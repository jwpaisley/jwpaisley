import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog-service/dialog-service';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { EmojiPickerDialog } from '../emoji-picker-dialog/emoji-picker-dialog';
import { AddRecipeTagDialog } from '../add-recipe-tag-dialog/add-recipe-tag-dialog';

@Component({
  selector: 'jwpaisley-dialog-display',
  standalone: true,
  imports: [CommonModule, ConfirmationDialog, EmojiPickerDialog, AddRecipeTagDialog],
  templateUrl: './dialog-display.html',
  styleUrl: './dialog-display.scss'
})
export class DialogDisplay {
  protected dialogService = inject(DialogService);
  protected config = this.dialogService.config;

  handleConfirm(value?: any): void {
    this.dialogService.close(true, value);
  }

  handleCancel(): void {
    this.dialogService.close(false);
  }
}