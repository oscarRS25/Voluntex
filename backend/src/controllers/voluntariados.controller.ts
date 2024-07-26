import { Request, Response, text } from 'express';

import pool from '../connection';

class VoluntariadoController{

  // GET
  public async obtenerVoluntariados (req: Request, res: Response){
      const voluntariados = await pool.query('SELECT v.*, e.nomEmpresa, e.email, e.telefono FROM voluntariados as v INNER JOIN usuarios as e on v.fkEmpresa = e.id;');
      res.json(voluntariados);
  }

  public async obtenerPorEmpresa (req: Request, res: Response){
    const { fkEmpresa } = req.params
    const voluntariados = await pool.query('SELECT * FROM voluntariados WHERE fkEmpresa = ?',[fkEmpresa]);
    res.json(voluntariados);
  }

  public async obtenerPorVoluntario (req: Request, res: Response){
    const { id } = req.params
    const voluntariados = await pool.query('SELECT v.*, e.nomEmpresa, e.email, e.telefono  FROM voluntariados as v INNER JOIN registros as r ON v.id = r.fkVoluntariado INNER JOIN usuarios as u ON r.fkVoluntario = u.id INNER JOIN usuarios as e ON v.fkEmpresa = e.id WHERE u.id = ?',[id]);
    res.json(voluntariados);
  }

  public async verVoluntariado (req: Request, res: Response){
    const { id } = req.params
    const voluntariado = await pool.query('SELECT v.*, u.nomEmpresa, u.email, u.telefono FROM voluntariados as v INNER JOIN usuarios as u on v.fkEmpresa = u.id WHERE v.id = ?;',[id]);
    res.json(voluntariado[0]);
  }

  public async registrarVoluntariado(req: Request, res: Response): Promise<void> {
      try {
        const result = await pool.query('INSERT INTO voluntariados SET ?',[req.body]);
        res.status(200).json({ message: 'Se registró el voluntariado correctamente', insertedId: result.insertId });
      } catch (error) {
        console.error('Error al registrar el voluntariado:', error);
        res.status(500).json({ message: 'Error al registrar el voluntariado' });
      }
  }
      
  public async modificarVoluntariado(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
        await pool.query('UPDATE voluntariados SET ? WHERE id = ?', [req.body, id]);
        res.json({ message: 'El voluntariado ha sido actualizado' });
      } catch (error) {
        console.error('Error al modificar el voluntariado:', error);
        res.status(500).json({ message: 'Error al modificar el voluntariado' });
      }
  }

  public async terminarVoluntariado(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        
        // Obtener la fecha actual y formatearla a YYYY-MM-DD
        const fecha = new Date();
        const fechaCierre = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
        
        // Actualizar estatus a 1 y asignar la fecha actual a fechaCierre
        await pool.query('UPDATE voluntariados SET estatus = 1, fechaCierre = ? WHERE id = ?', [fechaCierre, id]);
        res.json({ message: 'El voluntariado ha sido culminado' });
    } catch (error) {
        console.error('Error al culminar el voluntariado:', error);
        res.status(500).json({ message: 'Error al culminar el voluntariado' });
    }
  }
      
  public async eliminarVoluntariado(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        // Consultar el valor de ingresos
        const [result] = await pool.query('SELECT ingresos FROM voluntariados WHERE id = ?', [id]);

        if (result.length === 0) {
            res.status(404).json({ message: 'Voluntariado no encontrado' });
            return;
        }

        if (result.ingresos != 0) {
            res.status(400).json({ message: 'No se puede eliminar el voluntariado porque ya tiene voluntarios registrados' });
            return;
        }

        // Eliminar el voluntariado si ingresos es 0
        await pool.query('DELETE FROM voluntariados WHERE id = ?', [id]);
        res.json({ message: 'El voluntariado ha sido eliminado' });
    } catch (error) {
        console.error('Error al eliminar el voluntariado:', error);
        res.status(500).json({ message: 'Error al eliminar el voluntariado' });
    }
  }
}

export const voluntariadoController = new VoluntariadoController();
export default voluntariadoController;