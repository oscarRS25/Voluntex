import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.inteface';
import { Empresa } from '../../models/empresa.interface';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmpresaService } from '../../services/empresa.service';
import { RegistroResponse } from '../../models/RegistroResponse.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  captchaValidate: boolean = false;
  siteKey: string = '6LeF-_spAAAAAKKhS4KriR-VZLrY5atl2n0jt3g6';
  
  usuario: Usuario = {}
  empresa: Empresa = {}
  confirmPassword: string = '';
  datoSesion: any;

  btnDisable: boolean = false;

  constructor(
    private http: HttpClient, 
    private usuarioService: UsuarioService, 
    private empresaService: EmpresaService, 
    private loginService: LoginService, 
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.datoSesion = this.authService.getUserData();
    if(this.datoSesion){
      this.router.navigate(['/']);
      return;
    }
  }

  mostrarFormulario(){
    this.captchaValidate = true;
  }

  validarDatos(){
    // Validación del nombre de la empresa
    if (!this.empresa || !this.empresa.nombre || this.empresa.nombre.length < 2 || this.empresa.nombre.length > 50) {
      this.toastr.error('El nombre de la empresa debe tener entre 2 y 50 caractéres', 'Error', {timeOut: 3000});
      return;
    }

    // Validación del nombre completo del usuario
    if (!this.usuario || !this.usuario.nombre || !this.usuario.apePaterno || !this.usuario.apeMaterno || 
      this.usuario.nombre.length < 3 || this.usuario.apePaterno.length < 3 || this.usuario.apeMaterno.length < 3 ||
      this.usuario.nombre.length > 50 || this.usuario.apePaterno.length > 50 || this.usuario.apeMaterno.length > 50) {
        this.toastr.error('El nombre completo del usuario debe tener entre 3 y 50 caracteres por cada campo', 'Error', {timeOut: 3000});
        return;
    }

    // Validación de la fecha de nacimiento
    if (!this.usuario.fechaNac) {
      this.toastr.error('La fecha de nacimiento es requerida', 'Error', {timeOut: 3000});
      return;
    }

    // Validación de la fecha de nacimiento
    const fechaNacimiento = new Date(this.usuario.fechaNac);
    const fechaActual = new Date();
    if (fechaNacimiento >= fechaActual) {
        this.toastr.error('La fecha de nacimiento debe ser anterior a la fecha actual', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del correo electrónico
    if (!this.usuario.email) {
      this.toastr.error('El correo electrónico es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.email)) {
        this.toastr.error('Ingrese un correo electrónico válido', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del teléfono
    if (!this.usuario.telefono) {
      this.toastr.error('El teléfono es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const telRegex = /^\d{10}$/;
    if (!telRegex.test(this.usuario.telefono)) {
        this.toastr.error('Ingrese un teléfono válido (10 dígitos numéricos)', 'Error', {timeOut: 3000});
        return;
    }

    // Validación de la contraseña (aquí debes implementar tu lógica para definir qué es una contraseña segura)
    if (!this.usuario || !this.usuario.password || this.usuario.password.length < 8 || this.usuario.password.length > 16) {
      this.toastr.error('La contraseña debe tener entre 8 y 16 caractéres', 'Error', {timeOut: 3000});
      return;
    }

    const hasUpperCase = /[A-Z]/.test(this.usuario.password);
    const hasLowerCase = /[a-z]/.test(this.usuario.password);
    const hasNumbers = /[0-9]/.test(this.usuario.password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(this.usuario.password);

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

    if (this.usuario.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error de Registro');
      return;
    }

    this.usuarioService.validarEmailTel(this.usuario).subscribe(res => {
      console.log(res)
      this.btnDisable = true;
      this.register()
    },
      err => {
      console.log(err);
      this.toastr.error(err.error.message,'Error',{timeOut: 3000})
      return;
    })
  }

  register(){
    this.usuario.areaFk =  null;
    this.usuario.rolFk = 1;

    this.empresaService.registrarEmpresa(this.empresa).subscribe((res: RegistroResponse) => {
      this.usuario.empresaFk = res.insertedId;
      this.usuarioService.registrarUsuario(this.usuario).subscribe(res =>{
        this.login()
      },err =>{
        this.btnDisable = false;
        this.toastr.error('No se pudieron registrar los datos correctamente, por favor comuníquese con nosotros','Error',{timeOut: 5000})
      })
    },err =>{
      this.btnDisable = false;
    })
  }

  login() {
    this.loginService.inicio_sesion(this.usuario).subscribe(
      (res: any) => {
        console.log(res)
        const token = res.token;

        localStorage.setItem('token', token);
        
        window.location.href = '/areas';
      },
      (err) => {
        this.toastr.warning(
          'Email o contraseña incorrectos',
          'Acceso denegado',
          {
            timeOut: 3000,
          }
        );
      }
    );
  }
}
