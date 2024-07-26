import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { HomeComponent } from './components/home/home.component';
import { VoluntariadosComponent } from './components/voluntariados/voluntariados.component';
import { RegistroVoluntarioComponent } from './components/registro-voluntario/registro-voluntario.component';
import { RegistroEmpresaComponent } from './components/registro-empresa/registro-empresa.component';
import { RegistroQuienComponent } from './components/registro-quien/registro-quien.component';
import { AddVoluntariadoComponent } from './components/add-voluntariado/add-voluntariado.component';
import { VerVoluntariadoComponent } from './components/ver-voluntariado/ver-voluntariado.component';
import { VoluntariadoGuard } from './guards/voluntariado.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroQuienComponent
  },
  {
    path: 'registrar-empresa',
    component: RegistroEmpresaComponent,
  },
  {
    path: 'registrar-voluntario',
    component: RegistroVoluntarioComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
  },
  {
    path: 'politica-privacidad',
    component: PoliticaPrivacidadComponent,
  },
  {
    path: 'voluntariados',
    component: VoluntariadosComponent,
  },
  {
    path: 'registrar-voluntariado',
    component: AddVoluntariadoComponent
  },
  {
    path: 'voluntariado/:id',
    component: VerVoluntariadoComponent,
    canActivate: [VoluntariadoGuard]
  },
  {
    path: 'notFound',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '/notFound',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
