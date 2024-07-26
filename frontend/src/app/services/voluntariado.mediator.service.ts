import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Voluntariado } from "../models/voluntariado.interface";

@Injectable({
    providedIn: 'root'
})

// Mediator

export class VoluntariadoMediatorService {
    private voluntariadoSubject = new Subject<Voluntariado>();
  
    voluntariadoUpdates$ = this.voluntariadoSubject.asObservable();
  
    updateVoluntariado(voluntariado: Voluntariado) {
      this.voluntariadoSubject.next(voluntariado);
    }
}
  