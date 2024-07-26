import { Request, Response, text } from 'express';

import pool from '../connection';

class RegistroController{

  public async obtenerVoluntariosRegistrados (req: Request, res: Response){
    const { fkVoluntariado } = req.params
    const registrados = await pool.query('SELECT r.fechaReg, u.nombre, u.apePat, u.apeMat, u.email, u.telefono FROM registros as r INNER JOIN usuarios as u ON r.fkVoluntario = u.id WHERE r.fkVoluntariado = ?;',fkVoluntariado);
    res.json(registrados);
  }

  public async validarVoluntarioRegistrado(req: Request, res: Response): Promise<void> {
    try {
      const { fkVoluntariado, fkVoluntario } = req.params;
  
      // Validar los parámetros
      if (!fkVoluntariado || !fkVoluntario) {
        res.status(400).json({ error: 'Parámetros faltantes' });
        return;
      }
  
      // Ejecutar la consulta
      const [result] = await pool.query('SELECT * FROM registros WHERE fkVoluntariado = ? AND fkVoluntario = ?', [fkVoluntariado, fkVoluntario]);

      // Verificar si el registro existe
      if (result) {
        res.json({ registrado: true });
      } else {
        res.json({ registrado: false });
      }
    } catch (error) {
      console.error('Error al validar el voluntario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  public async registrarVoluntario(req: Request, res: Response): Promise<void> {
    const { fkVoluntariado } = req.body;
  
    try {
      // Verificar vacantes disponibles
      const voluntariado = await pool.query('SELECT cupo, ingresos FROM voluntariados WHERE id = ?', [fkVoluntariado]);
      
      if (voluntariado.length === 0) {
        res.status(404).json({ message: 'Voluntariado no encontrado' });
        return
      }
      
      const { cupo, ingresos } = voluntariado[0];
      
      if (ingresos >= cupo) {
        res.status(400).json({ message: 'No hay vacantes disponibles' });
        return
      }
      
      // Registrar al voluntario
      const result = await pool.query('INSERT INTO registros SET ?', [req.body]);
      
      // Actualizar ingresos en voluntariados
      await pool.query('UPDATE voluntariados SET ingresos = ingresos + 1 WHERE id = ?', [fkVoluntariado]);
  
      res.status(200).json({ message: 'Se registró el voluntario correctamente', insertedId: result.insertId });
    } catch (error) {
      console.error('Error al registrar el voluntario:', error);
      res.status(500).json({ message: 'Error al registrar el voluntario' });
    }
  }
      
  public async darDeBajaVoluntario(req: Request, res: Response): Promise<void> {
    const { fkVoluntariado, fkVoluntario } = req.body;
  
    try {
      // Verificar existencia del registro
      const registro = await pool.query('SELECT id FROM registros WHERE fkVoluntariado = ? AND fkVoluntario = ?', [fkVoluntariado, fkVoluntario]);
      
      if (registro.length === 0) {
        res.status(404).json({ message: 'Registro no encontrado' });
        return
      }
      
      const registroId = registro[0].id;
      
      // Eliminar el registro
      await pool.query('DELETE FROM registros WHERE id = ?', [registroId]);
      
      // Actualizar ingresos en voluntariados
      await pool.query('UPDATE voluntariados SET ingresos = ingresos - 1 WHERE id = ?', [fkVoluntariado]);
  
      res.status(200).json({ message: 'El voluntario ha sido dado de baja correctamente' });
    } catch (error) {
      console.error('Error al dar de baja al voluntario:', error);
      res.status(500).json({ message: 'Error al dar de baja al voluntario' });
    }
  }
}

export const registroController = new RegistroController();
export default registroController;