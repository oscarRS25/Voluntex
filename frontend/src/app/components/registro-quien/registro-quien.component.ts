import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-quien',
  templateUrl: './registro-quien.component.html',
  styleUrl: './registro-quien.component.css'
})
export class RegistroQuienComponent implements OnInit{

  datoSesion: any;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit() {
    this.datoSesion = this.authService.getUserData();
    if(this.datoSesion){
      this.router.navigate(['/']);
      return;
    }
  }
}
