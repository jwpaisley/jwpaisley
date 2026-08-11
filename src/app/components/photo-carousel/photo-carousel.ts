import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-photo-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-carousel.html',
  styleUrl: './photo-carousel.scss',
})
export class PhotoCarousel {
  @Input() photoUrls: string[] = [];
  @Input() scrollSeconds: number = 5;

  currentIndex = 0;

  get hasMultiplePhotos(): boolean {
    return this.photoUrls.length > 1;
  }

  get currentPhoto(): string | null {
    return this.photoUrls[this.currentIndex] ?? null;
  }

  goToPrevious(): void {
    if (!this.photoUrls.length) {
      return;
    }

    this.currentIndex = this.currentIndex === 0 ? this.photoUrls.length - 1 : this.currentIndex - 1;
  }

  goToNext(): void {
    if (!this.photoUrls.length) {
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.photoUrls.length;
  }
}
