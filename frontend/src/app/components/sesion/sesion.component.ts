import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { timer } from 'rxjs';
import { Usuario } from '../../models/usuario.inteface';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {

  extensionModalAbierto: boolean = false;
  caducadaModalAbierto: boolean = false;
  tiempoRestante: number = 60; // tiempo en segundos
  intervalo: any;

  usuario: Usuario = {};

  datoSesion: any;
  idUsuario = null;
  idRol: any = null;

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.datoSesion = this.authService.getUserData();

    if (this.datoSesion) {
      this.idUsuario = this.datoSesion.id;
      this.idRol = this.datoSesion.idRol;
    }

    if(this.idUsuario != null){
      this.usuarioService.obtenerCredenciales(this.idUsuario).subscribe(res =>{
        this.usuario = res;
        console.log(res);
        this.iniciarTemporizador();
      });
    }

    // Restaurar tiempo restante desde localStorage si existe
    const tiempoGuardado = localStorage.getItem('tiempoRestante');

    if (tiempoGuardado) {
      this.tiempoRestante = parseInt(tiempoGuardado, 10);
      if(this.tiempoRestante <= 30 && this.tiempoRestante > 3){
        this.extensionModalAbierto = true;
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    if(this.tiempoRestante > 0){
      localStorage.setItem('tiempoRestante', this.tiempoRestante.toString());
    }
  }

  iniciarTemporizador(): void {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;

      if (this.tiempoRestante <= 0) {
        localStorage.removeItem('token');
        localStorage.removeItem('tiempoRestante');
        this.caducadaModalAbierto = true;
        this.extensionModalAbierto = false;
        clearInterval(this.intervalo);

      } else if (this.tiempoRestante == 30) {
        this.extensionModalAbierto = true;
      }
    }, 1000);
  }

  extendSession(): void {
    this.tiempoRestante = 60;
    localStorage.removeItem('token');
    this.loginService.inicio_sesion(this.usuario).subscribe((res: any) =>{
      const token = res.token;
      localStorage.setItem('token', token);
      this.extensionModalAbierto = false;
    });
  }

  expiredSession(){
    window.location.href = '/login';
    this.caducadaModalAbierto = false;
  } 
}