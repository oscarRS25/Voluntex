import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Voluntariado } from '../models/voluntariado.interface';

@Injectable({
  providedIn: 'root'
})

// Observer
export class FormularioVoluntariadoService {
  private voluntariadoSubject = new BehaviorSubject<Voluntariado | null>(null);
  voluntariado$ = this.voluntariadoSubject.asObservable();

  actualizarVoluntariado(voluntariado: Voluntariado) {
    this.voluntariadoSubject.next(voluntariado);
  }
}
