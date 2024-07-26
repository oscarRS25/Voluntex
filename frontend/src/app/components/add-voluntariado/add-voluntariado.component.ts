import { Component, OnInit } from '@angular/core';
import { Voluntariado } from '../../models/voluntariado.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormularioVoluntariadoService } from '../../services/fomulario.voluntariado.service';
import { fechaCierrePosteriorValidator, nonNegativeValidator, nonZeroValidator } from '../../validators/custom.validator';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { VoluntariadoService } from '../../services/voluntariado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-voluntariado',
  templateUrl: './add-voluntariado.component.html',
  styleUrl: './add-voluntariado.component.css'
})
export class AddVoluntariadoComponent implements OnInit {

  formulario: FormGroup;
  voluntariado: Voluntariado | null = {};

  fechaInicio: Date = new Date()

  // Datos de la sesión
  datoSesion: any;
  id: any;
  rol: any;


  constructor(
    private fb: FormBuilder,
    private formularioVoluntariadoService: FormularioVoluntariadoService,
    private authService: AuthService,
    private voluntariadoService: VoluntariadoService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      cupo: ['', [Validators.required, Validators.max(9999), nonZeroValidator()]],
      costo: ['', [Validators.required, Validators.max(99999), nonNegativeValidator()]],
      pais: ['', [Validators.required, Validators.maxLength(45)]],
      estado: ['', [Validators.required, Validators.maxLength(45)]],
      ciudad: ['', [Validators.required, Validators.maxLength(45)]],
      fechaCierre: ['', [Validators.required, fechaCierrePosteriorValidator()]],
    });

    this.formulario.valueChanges.subscribe((voluntariado: Voluntariado) => {
      this.formularioVoluntariadoService.actualizarVoluntariado(voluntariado);
    });

    this.formularioVoluntariadoService.voluntariado$.subscribe((voluntariado) => {
      this.voluntariado = voluntariado;
    });
  }
  ngOnInit(): void {
    this.datoSesion = this.authService.getUserData();
    if(this.datoSesion){
      this.id = this.datoSesion.id;
      this.rol = this.datoSesion.rol;
    }
    if(this.rol != 1){
      this.router.navigate(['/']);
      return;
    }
  }

  registrar(){
    if(this.voluntariado){
      this.voluntariado.estatus = 0;
      this.voluntariado.fechaInicio = (() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
      this.voluntariado.ingresos = 0;
      this.voluntariado.fkEmpresa = this.id;
    }
    this.voluntariadoService.registrarVoluntariado(this.voluntariado).subscribe(res =>{
      this.toastr.success('Se ha registrado el voluntariado exitosamente', 'Éxito', { timeOut: 5000 });
      this.router.navigate(['/voluntariados']);
      return;
    },err => {
      this.toastr.error('No se pudo registrar el voluntariado, por favor intentelo nuevamente', 'Error', { timeOut: 5000 });
    })
  }
}
