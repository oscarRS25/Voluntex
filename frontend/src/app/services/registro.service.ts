import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registro } from '../models/registro.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = ' 44.223.130.111/api/registros';

  constructor(private http: HttpClient) { }

  // Obtener voluntarios registrados en un voluntariado específico
  obtenerVoluntariosRegistrados(fkVoluntariado: number): Observable<Registro[]> {
    const url = `${this.apiUrl}/${fkVoluntariado}`;
    return this.http.get<Registro[]>(url);
  }

  // Validar si un voluntario está registrado en un voluntariado específico
  validarVoluntarioRegistrado(fkVoluntariado: number, fkVoluntario: number): Observable<any> {
    const url = `${this.apiUrl}/${fkVoluntariado}/${fkVoluntario}`;
    return this.http.get<any>(url);
  }

  // Registrar un nuevo voluntario
  registrarVoluntario(registro: Registro): Observable<Object> {
    const url = `${this.apiUrl}/registrar`;
    return this.http.post(url, registro);
  }

  // Dar de baja a un voluntario
  darDeBajaVoluntario(registro: Registro): Observable<Object> {
    const url = `${this.apiUrl}/darDeBaja`;
    return this.http.post(url, registro);
  }
}