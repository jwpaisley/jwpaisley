import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe-photo-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-photo-carousel.html',
  styleUrl: './recipe-photo-carousel.scss',
})
export class RecipePhotoCarousel implements OnInit, OnDestroy {
  @Input() photoUrls: string[] = [];
  @Input() scrollSeconds: number = 5;

  currentIndex = 0;
  private autoAdvanceTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startAutoAdvance();
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

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

  private startAutoAdvance(): void {
    this.stopAutoAdvance();

    if (!this.photoUrls.length || this.scrollSeconds < 0 || this.scrollSeconds === 0) {
      return;
    }

    const safeScrollSeconds = this.scrollSeconds ?? 5;
    this.autoAdvanceTimer = setInterval(() => {
      this.goToNext();
    }, safeScrollSeconds * 1000);
  }

  private stopAutoAdvance(): void {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }
}
