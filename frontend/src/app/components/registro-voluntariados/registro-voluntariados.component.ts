import { Component } from '@angular/core';

@Component({
  selector: 'app-registro-voluntariados',
  
  templateUrl: './registro-voluntariados.component.html',
  styleUrl: './registro-voluntariados.component.css'
})
export class RegistroVoluntariadosComponent {
  onSubmit() {
    alert('Voluntariado registrado exitosamente!');
  }

}
