import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{

  constructor(private authService: AuthService) { }

  datosUsuario: any;
  rol: any = null;

  ngOnInit(): void {
    this.datosUsuario = this.authService.getUserData();
    if (this.datosUsuario) {
      this.rol = this.datosUsuario.idRol;
    }
  }
}