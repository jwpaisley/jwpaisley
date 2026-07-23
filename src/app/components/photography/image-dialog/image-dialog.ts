import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'jwpaisley-image-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './image-dialog.html',
  styleUrl: './image-dialog.scss',
})
export class ImageDialog {
  @Input() imageUrl: string | null = null;
  @Input() isOpen = false;
  @Input() showPrevious = false;
  @Input() showNext = false;
  @Output() closed = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.closed.emit();
  }
}
