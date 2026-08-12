import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'jwpaisley-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() title!: string;
  @Input() heightRem?: number;

  get resolvedHeight(): string {
    return this.heightRem != null ? `${this.heightRem}rem` : '100%';
  }
}
