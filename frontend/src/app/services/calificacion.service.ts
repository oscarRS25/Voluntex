import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calificacion } from '../models/calificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private apiUrl = 'http://localhost:3000/api/calificaciones';

  constructor(private http: HttpClient) { }

  // Obtener calificaciones para un voluntariado específico y un voluntario específico
  obtenerCalificaciones(fkVoluntariado: number, fkVoluntario: number): Observable<Calificacion[]> {
    const url = `${this.apiUrl}/${fkVoluntariado}/${fkVoluntario}`;
    return this.http.get<Calificacion[]>(url);
  }

  // Obtener el promedio de calificaciones para un voluntariado específico
  obtenerPromedio(fkVoluntariado: number): Observable<{ promedio: number }> {
    const url = `${this.apiUrl}/promedio/${fkVoluntariado}`;
    return this.http.get<{ promedio: number }>(url);
  }

  // Registrar una nueva calificación
  registrarCalificacion(calificacion: Calificacion): Observable<Object> {
    return this.http.post(this.apiUrl, calificacion);
  }
}
