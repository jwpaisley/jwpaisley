import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Tag } from '../tag/tag';
import { TagsListComponent } from '../tags-list/tags-list';
import { Button } from '../button/button';

@Component({
  selector: 'jwpaisley-tag-selector-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TagsListComponent, Button],
  templateUrl: './tag-selector-dialog.html',
  styleUrl: './tag-selector-dialog.scss',
})
export class TagSelectorDialog {
  @Input() title = 'select tags';
  @Input() text = 'choose tags for your recipe';
  @Input() confirmLabel = 'add tags';
  @Input() cancelLabel = 'cancel';
  @Input() availableTags: Tag[] = [];
  @Input() selectedTagIds: string[] = [];
  @Output() confirm = new EventEmitter<string[]>();
  @Output() cancel = new EventEmitter<void>();

  protected selectedIds: string[] = [];

  ngOnInit(): void {
    this.selectedIds = [...this.selectedTagIds];
  }

  protected get tagsForDisplay(): Tag[] {
    return (this.availableTags ?? []).map((tag) => ({
      ...tag,
      selected: this.selectedIds.includes(tag.id),
    }));
  }

  protected onTagSelect(tagId: string): void {
    if (!this.selectedIds.includes(tagId)) {
      this.selectedIds = [...this.selectedIds, tagId];
    }
  }

  protected onTagUnselect(tagId: string): void {
    this.selectedIds = this.selectedIds.filter((currentTagId) => currentTagId !== tagId);
  }

  protected handleConfirm(): void {
    this.confirm.emit(this.selectedIds);
  }

  protected handleCancel(): void {
    this.cancel.emit();
  }
}
