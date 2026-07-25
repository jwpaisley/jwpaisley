import { Component, Input } from '@angular/core';

export type EmptyStateSize = 'large' | 'medium' | 'small';

@Component({
  selector: 'jwpaisley-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  @Input() emoji: string = '📷';
  @Input() title: string = 'Nothing here yet';
  @Input() subtitle: string = 'Try again later.';
  @Input() size: EmptyStateSize = 'large';

  get sizeClass(): string {
    return `empty-state--${this.size}`;
  }
}
