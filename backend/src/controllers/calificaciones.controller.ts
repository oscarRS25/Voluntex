import { Request, Response, text } from 'express';

import pool from '../connection';

class CalificacionController{

  // GET
  public async obtenerCalificaciones (req: Request, res: Response){
    const { fkVoluntariado, fkVoluntario } = req.params
    const calificaciones = await pool.query('SELECT c.*, u.nombre, u.apePat, u.apeMat FROM calificaciones AS c INNER JOIN usuarios AS u ON c.fkVoluntario = u.id WHERE fkVoluntariado = ? AND c.fkVoluntario != ? ORDER BY c.fecha DESC;',[fkVoluntariado, fkVoluntario]);
    res.json(calificaciones);
  }

  public async obtenerMiCalificacion (req: Request, res: Response){
    const { fkVoluntariado, fkVoluntario } = req.params
    const calificacion = await pool.query('Select c.*, u.nombre, u.apePat, u.apeMat from calificaciones as c INNER JOIN usuarios as u ON c.fkVoluntario = u.id WHERE c.fkVoluntariado = ? AND c.fkVoluntario = ?',[fkVoluntariado, fkVoluntario]);
    res.json(calificacion[0]);
  }

  public async obtenerPromedio(req: Request, res: Response): Promise<void> {
    try {
      const { fkVoluntariado } = req.params;
      const result = await pool.query('SELECT ROUND(AVG(calificacion), 0) AS promedio FROM calificaciones WHERE fkVoluntariado = ?', [fkVoluntariado]);
      
      // Accede al valor del promedio
      const promedio = result[0].promedio;
  
      // Enviar solo el valor del promedio
      res.json({ promedio });
    } catch (error) {
      console.error('Error al obtener el promedio:', error);
      res.status(500).json({ message: 'Error al obtener el promedio' });
    }
  }

  public async registrarCalificacion(req: Request, res: Response): Promise<void> {
      try {
        const result = await pool.query('INSERT INTO calificaciones SET ?',[req.body]);
        res.status(200).json({ message: 'Se registró la calificacion correctamente', insertedId: result.insertId });
      } catch (error) {
        console.error('Error al registrar la calificacion:', error);
        res.status(500).json({ message: 'Error al registrar la calificacion' });
      }
  }
}

export const calificacionController = new CalificacionController();
export default calificacionController;