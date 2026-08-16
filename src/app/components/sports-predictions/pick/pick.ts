import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'jwpaisley-pick',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pick.html',
  styleUrl: './pick.scss',
})
export class Pick {
  @Input({ required: true }) pickerName!: string;
  @Input() pickerImageUrl?: string | null;
  @Input({ required: true }) fixtureLabel!: string;
  @Input({ required: true }) pickLabel!: string;
  @Input({ required: true }) payoutPoints!: number;
  @Input() status = 'pending';
  @Input() createdAt?: string | null;

  formatCreatedAt(value?: string | null): string {
    if (!value) {
      return 'recent';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'recent';
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  }

  get pickerInitials(): string {
    const words = (this.pickerName || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (words.length === 0) {
      return '?';
    }

    return words.map((word) => word.charAt(0).toUpperCase()).join('');
  }
}
