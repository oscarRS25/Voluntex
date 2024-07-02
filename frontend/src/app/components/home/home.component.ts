import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  typingText: string = '';
  private fullText: string =
    'No esperes más, somos la solución a tus problemas';
  private index: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.typeWriter();
  }

  typeWriter(): void {
    if (this.index < this.fullText.length) {
      this.typingText += this.fullText.charAt(this.index);
      this.index++;
      setTimeout(() => this.typeWriter(), 100);
    } else {
      setTimeout(() => {
        this.typingText = '';
        this.index = 0;
        this.typeWriter();
      }, 1);
    }
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }
}
