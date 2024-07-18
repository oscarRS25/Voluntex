import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  datosUsuario: any;
  usuario: any = null;
  rol: any = null;
  plan: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.datosUsuario = this.authService.getUserData();
    if (this.datosUsuario) {
      this.usuario = this.datosUsuario.nombre;
      this.rol = this.datosUsuario.rol;
    }
  }

  cerrarSesion(){
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
