import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type MessageLevel = 'info' | 'warning' | 'success' | 'danger';

@Component({
  selector: 'jwpaisley-message',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class Message {
  @Input() level: MessageLevel = 'info';
  @Input() icon = 'info';
  @Input() message = '';

  get levelClass(): string {
    return `message--${this.level}`;
  }
}
