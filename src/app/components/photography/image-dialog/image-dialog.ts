import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommentsSection } from '../../comments-section/comments-section';

@Component({
  selector: 'jwpaisley-image-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, CommentsSection],
  templateUrl: './image-dialog.html',
  styleUrl: './image-dialog.scss',
})
export class ImageDialog {
  @Input() imageUrl: string | null = null;
  @Input() caption: string | null = null;
  @Input() resourceId: string | null = null;
  @Input() isOpen = false;
  @Input() showPrevious = false;
  @Input() showNext = false;
  @Output() closed = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  protected isCommentsOpen = false;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (!this.isOpen || !this.showPrevious) {
      return;
    }

    this.previous.emit();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (!this.isOpen || !this.showNext) {
      return;
    }

    this.next.emit();
  }

  get displayCaption(): string {
    return (this.caption ?? '').toLowerCase();
  }

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isCommentsOpen = false;
    this.closed.emit();
  }

  openComments(): void {
    this.isCommentsOpen = true;
  }

  closeComments(): void {
    this.isCommentsOpen = false;
  }
}
