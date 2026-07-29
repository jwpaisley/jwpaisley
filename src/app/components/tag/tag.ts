import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Tag {
  id: string;
  title: string;
  selected: boolean;
}

@Component({
  selector: 'jwpaisley-tag',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
})
export class TagComponent {
  @Input() tag!: Tag;
  @Output() selected = new EventEmitter<string>();
  @Output() unselected = new EventEmitter<string>();

  protected onTagClick(): void {
    if (!this.tag.selected) {
      this.selected.emit(this.tag.id);
    }
  }

  protected onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.tag.selected) {
      this.unselected.emit(this.tag.id);
    }
  }
}
