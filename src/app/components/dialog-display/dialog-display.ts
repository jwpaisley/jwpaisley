import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog-service/dialog-service';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { EmojiPickerDialog } from '../emoji-picker-dialog/emoji-picker-dialog';
import { AddRecipeTagDialog } from '../add-recipe-tag-dialog/add-recipe-tag-dialog';
import { TagSelectorDialog } from '../tag-selector-dialog/tag-selector-dialog';
import { Tag } from '../tag/tag';

@Component({
  selector: 'jwpaisley-dialog-display',
  standalone: true,
  imports: [CommonModule, ConfirmationDialog, EmojiPickerDialog, AddRecipeTagDialog, TagSelectorDialog],
  templateUrl: './dialog-display.html',
  styleUrl: './dialog-display.scss'
})
export class DialogDisplay {
  protected dialogService = inject(DialogService);
  protected config = this.dialogService.config;

  protected get tagSelectorDialogData(): { availableTags: Tag[]; selectedTagIds: string[] } | null {
    if (this.config()?.type !== 'tag-selector') {
      return null;
    }

    const value = this.config()?.value as { availableTags?: Tag[]; selectedTagIds?: string[] } | undefined;

    return {
      availableTags: Array.isArray(value?.availableTags) ? value.availableTags : [],
      selectedTagIds: Array.isArray(value?.selectedTagIds) ? value.selectedTagIds : [],
    };
  }

  handleConfirm(value?: any): void {
    this.dialogService.close(true, value);
  }

  handleCancel(): void {
    this.dialogService.close(false);
  }
}