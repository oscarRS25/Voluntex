import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voluntariado } from '../models/voluntariado.interface';

@Injectable({
  providedIn: 'root'
})
export class VoluntariadoService {

  private apiUrl = 'h172.31.25.15/api/voluntariados';

  constructor(private http: HttpClient) { }

  // Obtener todos los voluntariados
  obtenerVoluntariados(): Observable<Voluntariado[]> {
    return this.http.get<Voluntariado[]>(this.apiUrl);
  }

  // Obtener voluntariados por empresa
  obtenerPorEmpresa(fkEmpresa: number): Observable<Voluntariado[]> {
    const url = `${this.apiUrl}/empresa/${fkEmpresa}`;
    return this.http.get<Voluntariado[]>(url);
  }

  // Obtener voluntariados por voluntario
  obtenerPorVoluntario(id: number): Observable<Voluntariado[]> {
    const url = `${this.apiUrl}/voluntario/${id}`;
    return this.http.get<Voluntariado[]>(url);
  }

  // Obtener un voluntariado específico
  verVoluntariado(id: any): Observable<Voluntariado> {
    const url = `${this.apiUrl}/ver/${id}`;
    return this.http.get<Voluntariado>(url);
  }

  // Registrar un nuevo voluntariado
  registrarVoluntariado(voluntariado: any): Observable<Object> {
    return this.http.post(this.apiUrl, voluntariado);
  }

  // Modificar un voluntariado existente
  modificarVoluntariado(id: number, voluntariado: Voluntariado): Observable<Object> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, voluntariado);
  }

  // Terminar un voluntariado
  terminarVoluntariado(id: number): Observable<Object> {
    const url = `${this.apiUrl}/terminar/${id}`;
    return this.http.put(url, {});
  }

  // Eliminar un voluntariado
  eliminarVoluntariado(id: number): Observable<Object> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}