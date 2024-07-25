import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TokenInterceptor } from './services/HttpInterceptor.service';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroEmpresaComponent } from './components/registro-empresa/registro-empresa.component';
import { RegistroQuienComponent } from './components/registro-quien/registro-quien.component';
import { RegistroVoluntarioComponent } from './components/registro-voluntario/registro-voluntario.component';
import { VoluntariadosComponent } from './components/voluntariados/voluntariados.component';
import { RegistroVoluntariadosComponent } from './components/registro-voluntariados/registro-voluntariados.component';


import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegistroEmpresaComponent,
    RegistroVoluntarioComponent,
    RegistroQuienComponent,
    ChangePasswordComponent,
    RegistroVoluntariadosComponent,
    PoliticaPrivacidadComponent,
    VoluntariadosComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxCaptchaModule,
    MatCardModule,
    MatStepperModule,
    MatInputModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
