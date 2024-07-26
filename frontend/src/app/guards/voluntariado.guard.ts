// guards/voluntariado.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VoluntariadoService } from '../services/voluntariado.service';

@Injectable({
  providedIn: 'root'
})
export class VoluntariadoGuard implements CanActivate {

  constructor(private voluntariadoService: VoluntariadoService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const id = route.paramMap.get('id');
    return this.voluntariadoService.verVoluntariado(id!).pipe(
      map(voluntariado => {
        if (voluntariado && (!Array.isArray(voluntariado) || voluntariado.length > 0)) {
          return true;
        } else {
          return this.router.createUrlTree(['/notFound']);
        }
      })
    );
  }
}
