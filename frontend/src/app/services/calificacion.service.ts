import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calificacion } from '../models/calificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private apiUrl = '44.223.130.111/api/calificaciones';

  constructor(private http: HttpClient) { }

  // Obtener el promedio de calificaciones para un voluntariado específico
  obtenerPromedio(fkVoluntariado: any): Observable<{ promedio: number }> {
    const url = `${this.apiUrl}/promedio/${fkVoluntariado}`;
    return this.http.get<{ promedio: number }>(url);
  }

  // Obtener calificaciones para un voluntariado específico excluyendo la propia
  obtenerCalificaciones(fkVoluntariado: any, fkVoluntario: any): Observable<Calificacion[]> {
    const url = `${this.apiUrl}/todas/${fkVoluntariado}/${fkVoluntario}`;
    return this.http.get<Calificacion[]>(url);
  }

  // Obtener calificaciones para un voluntariado específico y un voluntario específico
  obtenerMiCalificacion(fkVoluntariado: any, fkVoluntario: any): Observable<Calificacion> {
    const url = `${this.apiUrl}/obtener/mia/${fkVoluntariado}/${fkVoluntario}`;
    return this.http.get<Calificacion>(url);
  }

  // Registrar una nueva calificación
  registrarCalificacion(calificacion: Calificacion): Observable<Object> {
    return this.http.post(this.apiUrl, calificacion);
  }
}
