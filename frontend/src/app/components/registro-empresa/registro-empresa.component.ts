import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.inteface';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrl: './registro-empresa.component.css'
})
export class RegistroEmpresaComponent implements OnInit {

  captchaValidate: boolean = false;
  siteKey: string = '6LeF-_spAAAAAKKhS4KriR-VZLrY5atl2n0jt3g6';
  
  usuario: Usuario = {}
  datoSesion: any;

  myForm: FormGroup;

  btnDisable: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService, 
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    public fb: FormBuilder
  ) { 
    this.myForm = this.fb.group({
      nomEmpresa: ['', [Validators.required, Validators.maxLength(70)]],
      pais: ['', [Validators.required, Validators.maxLength(50)]],
      estado: ['', [Validators.required, Validators.maxLength(50)]],
      ciudad: ['', [Validators.required, Validators.maxLength(50)]],
      calle: ['', [Validators.required, Validators.maxLength(50)]],
      numero: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.maxLength(60), Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apePat: ['', [Validators.required, Validators.maxLength(50)]],
      apeMat: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.datoSesion = this.authService.getUserData();
    if(this.datoSesion){
      this.router.navigate(['/']);
      return;
    }
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password != null && confirmPassword != null && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if(confirmPassword != null)
        confirmPassword.setErrors(null);
        return null;
    }
  }

  mostrarFormulario(){
    this.captchaValidate = true;
  }

  registrar(){
    if (this.myForm.invalid) {
      this.toastr.error('Por favor complete todos los campos correctamente', 'Error', { timeOut: 5000 });
      return;
    }

    this.btnDisable = true;

    const formValues = this.myForm.value;
    this.usuario = {
      nomEmpresa: formValues.nomEmpresa,
      pais: formValues.pais,
      estado: formValues.estado,
      ciudad: formValues.ciudad,
      calle: formValues.calle,
      numero: formValues.numero,
      telefono: formValues.telefono,
      email: formValues.email,
      nombre: formValues.nombre,
      apePat: formValues.apePat,
      apeMat: formValues.apeMat,
      password: formValues.password,
      rol: 1,
      fechaReg: (() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })()
    };

    this.usuarioService.validarEmailTel(this.usuario).subscribe(
      res => {
        this.usuarioService.registrarUsuario(this.usuario).subscribe(
          res => {
            this.login();
          },
          err => {
            this.toastr.error('No se pudieron registrar los datos correctamente, por favor comuníquese con nosotros', 'Error', { timeOut: 5000 });
          }
        );
      },
      err => {
        this.toastr.error(err.error.message, 'Error', { timeOut: 5000 });
      }
    );
  }

  login() {
    this.loginService.inicio_sesion(this.usuario).subscribe(
      (res: any) => {
        const token = res.token;
        localStorage.setItem('token', token);
        window.location.href = '/voluntariados';
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
