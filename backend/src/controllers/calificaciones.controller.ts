import { Request, Response, text } from 'express';

import pool from '../connection';

class CalificacionController{

  // GET
  public async obtenerCalificaciones (req: Request, res: Response){
    const { fkVoluntariado, fkVoluntario } = req.params
    const calificaciones = await pool.query('Select c.*, u.nombre, u.apePat, u.apeMat from calificaciones as c INNER JOIN usuarios as u ON c.fkVoluntario = u.id WHERE fkVoluntariado = ? ORDER BY (CASE WHEN c.fkVoluntario = ? THEN 0 ELSE 1 END), c.fecha DESC;',[fkVoluntariado, fkVoluntario]);
    res.json(calificaciones);
  }

  public async obtenerPromedio(req: Request, res: Response): Promise<void> {
    try {
      const { fkVoluntariado } = req.params;
      const result = await pool.query('SELECT AVG(calificacion) AS promedio FROM calificaciones WHERE fkVoluntariado = ?', [fkVoluntariado]);
      
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