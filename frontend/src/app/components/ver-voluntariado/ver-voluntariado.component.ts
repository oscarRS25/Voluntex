import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoluntariadoService } from '../../services/voluntariado.service';
import { AuthService } from '../../services/auth.service';
import { Voluntariado } from '../../models/voluntariado.interface';
import { DatePipe } from '@angular/common';
import { CalificacionService } from '../../services/calificacion.service';
import { Calificacion } from '../../models/calificacion.interface';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import Swal from 'sweetalert2';
import { Registro } from '../../models/registro.interface';
import { forkJoin } from 'rxjs';
import { VoluntariadoMediatorService } from '../../services/voluntariado.mediator.service';

@Component({
  selector: 'app-ver-voluntariado',
  templateUrl: './ver-voluntariado.component.html',
  styleUrl: './ver-voluntariado.component.css',
  providers: [DatePipe]
})
export class VerVoluntariadoComponent implements OnInit {

  // Variables de apoyo
  regComentario: FormGroup;

  // Datos del componente
  voluntariado: any = {};
  registrados: any[] = [];
  calificaciones: any[] = [];
  miCalificacion: any = {};
  newCalificacion: Calificacion ={};
  newRegistro: Registro = {};
  promedio: any;
  voluntarioRegistrado: boolean = false;
  
  // Datos de la sesión
  datoSesion: any;
  id: any;
  rol: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private voluntariadoService: VoluntariadoService,
    private calificacionService: CalificacionService,
    private registroService: RegistroService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private voluntariadoMediatorService: VoluntariadoMediatorService,
  ) {
    this.regComentario = this.fb.group({
      calificacion: [1, [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.datoSesion = this.authService.getUserData();
    if(this.datoSesion){
      this.id = this.datoSesion.id;
      this.rol = this.datoSesion.rol;
    }
    if(this.rol == null){
      this.router.navigate(['/']);
      return;
    }
  
    const id = this.route.snapshot.paramMap.get('id');
    this.voluntariadoService.verVoluntariado(id).subscribe(res => {
      this.voluntariado = res;
      
      this.voluntariado.fechaInicio = this.datePipe.transform(this.voluntariado.fechaInicio, 'MMM d, y');
      this.voluntariado.fechaCierre = this.datePipe.transform(this.voluntariado.fechaCierre, 'MMM d, y');
      
      this.obtenerPromedio()
      if(this.rol == 2){
        this.validarRegistroVoluntario()
        this.obtenerMiCalificacion();
      }
      this.obtenerCalificaciones() 
      if(this.rol == 1 && this.voluntariado.fkEmpresa == this.id){
        this.obtenerRegistrados()
      }
    });
  }

  obtenerPromedio(): void{
    this.calificacionService.obtenerPromedio(this.voluntariado.id).subscribe(res =>{
      this.promedio = res.promedio
    },err =>{
      this.toastr.error('No se ha podido obtener la calificación promedio del voluntariado', 'Error', { timeOut: 5000 });
    })
  }

  obtenerCalificaciones(): void{
    this.calificacionService.obtenerCalificaciones(this.voluntariado.id, this.id).subscribe(res =>{
      this.calificaciones = res;
    },err =>{
      this.toastr.error('No se han podido obtener las calificaciones del voluntariado', 'Error', { timeOut: 5000 });
    })
  }

  obtenerMiCalificacion():void{
    this.calificacionService.obtenerMiCalificacion(this.voluntariado.id, this.id).subscribe(res =>{
      this.miCalificacion = res;
    },err =>{
      this.toastr.error('No se ha podido obtener tu calificación', 'Error', { timeOut: 5000 });
    })
  }

  obtenerRegistrados(): void{
    this.registroService.obtenerVoluntariosRegistrados(this.voluntariado.id).subscribe(res =>{
      this.registrados = res;
    }, err =>{
      this.toastr.error('No se han podido obtener los voluntarios registrados', 'Error', { timeOut: 5000 });
    })
  }

  validarRegistroVoluntario(): void{
    this.registroService.validarVoluntarioRegistrado(this.voluntariado.id, this.id).subscribe(res =>{
      this.voluntarioRegistrado = res.registrado;
    })
  }

  agregarComentario(){
    this.newCalificacion = {
      calificacion: this.regComentario.get('calificacion')?.value,
      descripcion: this.regComentario.get('descripcion')?.value,
      fecha: this.nuevaFecha(),
      fkVoluntariado: this.voluntariado.id,
      fkVoluntario: this.id
    }
    this.calificacionService.registrarCalificacion(this.newCalificacion).subscribe(res =>{
      this.toastr.success('Se ha registrado correctamente su calificación', 'Éxito', { timeOut: 5000 });
      this.ngOnInit()
    }, err =>{
      this.toastr.error('No se ha pudo registrar la calificación correctamente', 'Error', { timeOut: 5000 });
    })
  }

  cerrarVoluntariado() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez cerrado, el voluntariado no se podrá reabrir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#25344e',
      cancelButtonColor: '#812424',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voluntariadoService.terminarVoluntariado(this.voluntariado.id).subscribe(res => {
          this.toastr.success('Se ha cerrado el voluntariado exitosamente', 'Éxito', { timeOut: 5000 });
          this.ngOnInit();
        }, err => {
          this.toastr.error('No se ha podido cerrar el voluntariado', 'Error', { timeOut: 5000 });
        });
      }
    });
  }

  eliminarVoluntariado() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar el voluntariado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#25344e',
      cancelButtonColor: '#812424',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voluntariadoService.eliminarVoluntariado(this.voluntariado.id).subscribe(res => {
          this.toastr.success('Se ha eliminado el voluntariado exitosamente', 'Éxito', { timeOut: 5000 });
          this.router.navigate(['/voluntariados']);
        }, err => {
          this.toastr.error('No se ha podido eliminar el voluntariado', 'Error', { timeOut: 5000 });
        });
      }
    });
  }

  inscribirse() {
    this.newRegistro.fechaReg = this.nuevaFecha();
    this.newRegistro.fkVoluntariado = this.voluntariado.id;
    this.newRegistro.fkVoluntario = this.id;
    this.registroService.registrarVoluntario(this.newRegistro).subscribe(res => {
      this.toastr.success('Ha sido inscrito a su nuevo voluntariado', '¡Felicidades!', { timeOut: 5000 });
      this.voluntariado.ingresos += 1; // Actualiza localmente
      this.voluntariadoMediatorService.updateVoluntariado(this.voluntariado); // Notifica
      this.ngOnInit()
    }, err => {
      this.toastr.error('No se ha podido inscribir al voluntariado, puede que el cupo haya sido llenado', 'Error', { timeOut: 5000 });
    });
  }

  getStars(calificacion: number): number[] {
    return Array(calificacion).fill(1);
  }

  nuevaFecha(){
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}