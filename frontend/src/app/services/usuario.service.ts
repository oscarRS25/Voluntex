import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.inteface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuario(id: number): Observable<Usuario> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Usuario>(url);
  }

  obtenerUsuarioEmail(email: string): Observable<Usuario>{
    const url = `${this.apiUrl}/getByEmail/${email}`;
    return this.http.get<Usuario>(url);
  }

  obtenerCredenciales(id_user: any){
    return this.http.get(`${this.apiUrl}/credenciales/${id_user}`);
  }

  enviarEmailConfirmacion(email: string): Observable<Object>{
    const url = `${this.apiUrl}/password/${email}`;
    return this.http.get<Object>(url);
  }

  registrarUsuario(usuario: Usuario) {
    return this.http.post(`${this.apiUrl}/`, usuario);
  }

  modificarUsuario(id: any, usuarioActualizado: Usuario): Observable<Object> {
    return this.http.put(`${this.apiUrl}/${id}`, usuarioActualizado);
  }

  eliminarUsuario(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cambiarContrasena(id: any, email: any, usuarioActualizado: Usuario): Observable<Object> {
    return this.http.put(`${this.apiUrl}/password/${id}/${email}`,usuarioActualizado);
  }

  validarEmailTel(usuario: Usuario) {
    return this.http.post(`${this.apiUrl}/validarEmailTel`, usuario);
  }

  /*addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Usuario>(url, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }*/


}