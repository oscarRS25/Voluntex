import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'] // Corrección aquí
})
export class StarRatingComponent implements OnChanges {
  @Input() rating: number = 0; // Calificación en formato decimal
  starsArray: number[] = [1, 2, 3, 4, 5];
  fullStars: number = 0;
  hasHalfStar: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rating']) {
      this.updateStars();
    }
  }

  private updateStars(): void {
    this.fullStars = Math.floor(this.rating);
    this.hasHalfStar = (this.rating % 1) >= 0.5;
  }
}