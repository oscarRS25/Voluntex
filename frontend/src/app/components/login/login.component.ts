import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.inteface';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  showOtpModal: boolean = false;
  token: any = [];
  otp: string = '';
  isLoggingIn: boolean = false;

  usuario: Usuario = {
    email: '',
    password: '',
  };

  // Datos de la sesión
  datoSesion: any;

  ngOnInit(): void {
    // Validar si ya tiene una sesión abierta
    this.datoSesion = this.authService.getUserData();
    if(this.datoSesion){
      this.router.navigate(['/']);
      return;
    }

    delete this.usuario.email;
    delete this.usuario.password;
  }

  login() {
    this.isLoggingIn = true;
    if (this.usuario.email && this.usuario.password) {
      this.loginService.login(this.usuario).subscribe({
        next: (res: any) => {
          this.token = res.token;
          this.showOtpModal = true;
          this.isLoggingIn = false;
        },
        error: (err: any) => {
          this.toastr.warning('Credenciales Incorrectas', 'Error de Login', {
            timeOut: 3000,
          });
          this.isLoggingIn = false;
        },
      });
    } else {
      this.toastr.warning(
        'Email y contraseña son requeridos',
        'Campos Incompletos'
      );
      this.isLoggingIn = false;
    }
  }

  verifyOtp() {
    if (this.usuario.email) {
      this.loginService.verifyOtp(this.usuario.email, this.otp).subscribe({
        next: (res: any) => {
          this.showOtpModal = false;
          this.toastr.success('OTP verificado', 'Acceso Concedido', {
            timeOut: 3000,
          });
          localStorage.setItem('token', this.token);
          this.redirectUser();
        },
        error: (err: any) => {
          this.toastr.error(
            'OTP incorrecto o expirado',
            'Error de Verificación',
            {
              timeOut: 3000,
            }
          );
        },
      });
    } else {
      this.toastr.error('No se encontró el email del usuario', 'Error Interno');
    }
  }

  private redirectUser() {
    this.datoSesion = this.authService.getUserData();
    switch (this.datoSesion.fk_rol) {
      case 1:
        window.location.href = '/areas';
        break;
      case 2:
        window.location.href = '/notFound';
        break;
      case 3:
        window.location.href = '/';
        break;
      default:
        window.location.href = '/';
        break;
    }
  }

  closeModal() {
    this.showOtpModal = false;
    this.isLoggingIn = false;
  }
}
