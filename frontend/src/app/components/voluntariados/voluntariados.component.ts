import { Component, OnInit } from '@angular/core';
import { VoluntariadoService } from '../../services/voluntariado.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Voluntariado } from '../../models/voluntariado.interface';

@Component({
  selector: 'app-voluntariados',
  templateUrl: './voluntariados.component.html',
  styleUrl: './voluntariados.component.css'
})
export class VoluntariadosComponent implements OnInit{
  
  // Variables para el componente
  voluntariados: any[] = [];
  vistaVoluntariados: boolean = true;

  // Datos de la sesión
  datoSesion: any;
  id: any;
  rol: any;

  constructor(
    private voluntariadoService: VoluntariadoService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ){}
  
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

    if(this.rol == 2){
      this.obtenerTodos()
    }else if(this.rol == 1){
      this.obtenerTodosEmpresa()
    }
  }

  obtenerTodos(){
    this.voluntariadoService.obtenerVoluntariados().subscribe(res =>{
      this.voluntariados = res;
      this.vistaVoluntariados = true;
      console.log(this.voluntariados)
    }, err =>{
      this.toastr.error('No se han podido obtener los voluntariados', 'Error', { timeOut: 5000 });
    })
  }

  obtenerTodosEmpresa(){
    this.voluntariadoService.obtenerPorEmpresa(this.id).subscribe(res =>{
      this.voluntariados = res;
      console.log(this.voluntariados)
    }, err =>{
      this.toastr.error('No se han podido obtener los voluntariados', 'Error', { timeOut: 5000 });
    })
  }

  obtenerInscritos(){
    this.voluntariadoService.obtenerPorVoluntario(this.id).subscribe(res =>{
      this.voluntariados = res;
      this.vistaVoluntariados = false;
      console.log(this.voluntariados)
    }, err =>{
      this.toastr.error('No se han podido obtener los voluntariados', 'Error', { timeOut: 5000 });
    })
  }

  getStars(calificacion: number): number[] {
    return Array(calificacion).fill(1);
  }
}
