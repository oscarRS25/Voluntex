import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.inteface';
import { RegistroResponse } from '../../models/RegistroResponse.interface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{

  captchaValidate: boolean = false;
  siteKey: string = '6LeF-_spAAAAAKKhS4KriR-VZLrY5atl2n0jt3g6';

  emailDatos: boolean = false;
  codigoDatos: boolean = false;

  email: string = '';
  codigoRecibido: string = '';
  password: string = '';
  usuario: Usuario = {};

  codigo: string = '';
  resultado: any = [];

  // Datos de la sesion
  datoSesion: any;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Obtener datos del inicio de sesión
    this.datoSesion = this.authService.getUserData();

    if (this.datoSesion) {
      this.router.navigate(['/']);
      return;
    }
  }

  mostrarFormulario(){
    this.captchaValidate = true;
  }

  avanzarStepper(stepper: MatStepper) {
      stepper.next();
  }

  envioEmail(stepper: MatStepper) {

    // Validación del correo electrónico
    if (!this.email) {
      this.toastr.error('El correo electrónico es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
        this.toastr.error('Ingrese un correo electrónico válido', 'Error', {timeOut: 3000});
        return;
    }

    this.usuarioService.obtenerUsuarioEmail(this.email).subscribe(res=>{
      this.usuario = res;
      this.usuarioService.enviarEmailConfirmacion(this.email).subscribe((res: RegistroResponse) =>{
        this.emailDatos = true;
        this.codigo = res.insertedId;
        setTimeout(() => {
          this.avanzarStepper(stepper);
        }, 100);
      },err =>{
        this.toastr.error('No se ha podido enviar el correo, asegúrese de que este exista', 'Error', {timeOut: 3000});
          return;
      })
    },err =>{
      this.toastr.error('No se ha registrado este correo en la aplicación', 'Error', {timeOut: 3000});
        return;
    })
  }

  validarCodigo(stepper: MatStepper){
    if(this.codigoRecibido == this.codigo){
      this.codigoDatos = true;
      this.codigo = '';
      setTimeout(() => {
        this.avanzarStepper(stepper);
      }, 100);
    }else{
      this.toastr.error('El código no coincide, asegúrese de que sea el correcto', 'Error', {timeOut: 3000});
      return;
    }
  }

  cambiarPassword(){
    if (!this.password || this.password.length < 8 || this.password.length > 16) {
      this.toastr.error('La contraseña debe tener entre 8 y 16 caractéres', 'Error', {timeOut: 3000});
      return;
    }

    const hasUpperCase = /[A-Z]/.test(this.password);
    const hasLowerCase = /[a-z]/.test(this.password);
    const hasNumbers = /[0-9]/.test(this.password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(this.password);

    if (!hasUpperCase) {
      this.toastr.error('La contraseña debe incluir al menos una letra mayúscula', 'Error', { timeOut: 3000 });
      return;
    }

    if (!hasLowerCase) {
      this.toastr.error('La contraseña debe incluir al menos una letra minúscula', 'Error', { timeOut: 3000 });
      return;
    }

    if (!hasNumbers ) {
      this.toastr.error('La contraseña debe incluir al menos un número', 'Error', { timeOut: 3000 });
      return;
    }

    if (!hasSpecialChars) {
      this.toastr.error('La contraseña debe incluir al menos un carácter especial', 'Error', { timeOut: 3000 });
      return;
    }

    this.usuario.password = this.password;
    this.usuarioService.modificarUsuario(this.usuario.id, this.usuario).subscribe(res=>{
      this.toastr.success('Se ha cambiado la contraseña correctamente', 'Exito', {timeOut: 3000});
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    })
  }
}