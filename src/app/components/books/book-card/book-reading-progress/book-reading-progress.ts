import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jwpaisley-book-reading-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-reading-progress.html',
  styleUrl: './book-reading-progress.scss',
})
export class BookReadingProgress {
  public currentPage = input.required<number>();
  public totalPages = input.required<number>();

  readonly radius = 54;
  readonly circumference = 2 * Math.PI * this.radius;

  percentage = computed(() => {
    if (this.totalPages() <= 0) return 0;

    const percentage = Math.floor((this.currentPage() / this.totalPages()) * 100);
    if (percentage > 100) return 100;
    if (percentage < 0) return 0;
    return percentage;
  });

  strokeOffset = computed(() => {
    const percent = this.percentage();
    return this.circumference - (percent / 100) * this.circumference;
  });
}