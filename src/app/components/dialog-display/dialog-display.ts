import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog-service/dialog-service';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { EmojiPickerDialog } from '../emoji-picker-dialog/emoji-picker-dialog';
import { AddRecipeTagDialog } from '../add-recipe-tag-dialog/add-recipe-tag-dialog';
import { AddPortDialog } from '../add-port-dialog/add-port-dialog';
import { AddSailboatDialog } from '../add-sailboat-dialog/add-sailboat-dialog';
import { AddSailboatPhotoDialog } from '../sailing/add-sailboat-photo-dialog/add-sailboat-photo-dialog';
import { AddPostDialog } from '../posts/add-post-dialog/add-post-dialog';
import { CreateSportsPredictionLeagueDialog } from '../sports-predictions/create-sports-prediction-league-dialog/create-sports-prediction-league-dialog';
import { TagSelectorDialog } from '../tag-selector-dialog/tag-selector-dialog';
import { AchievementDialog } from '../achievement-dialog/achievement-dialog';
import { Tag } from '../tag/tag';

@Component({
  selector: 'jwpaisley-dialog-display',
  standalone: true,
  imports: [CommonModule, ConfirmationDialog, EmojiPickerDialog, AchievementDialog, AddRecipeTagDialog, AddPortDialog, AddSailboatDialog, AddSailboatPhotoDialog, AddPostDialog, CreateSportsPredictionLeagueDialog, TagSelectorDialog],
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

  protected get achievementDialogData(): { emoji: string; subtitle: string; seconds: number } | null {
    if (this.config()?.type !== 'achievement') {
      return null;
    }

    const value = this.config()?.value as { emoji?: string; subtitle?: string; seconds?: number } | undefined;

    return {
      emoji: value?.emoji || this.config()?.emoji || this.config()?.icon || '🎉',
      subtitle: value?.subtitle || this.config()?.subtitle || this.config()?.text || '',
      seconds: value?.seconds ?? this.config()?.seconds ?? 5,
    };
  }

  handleConfirm(value?: any): void {
    this.dialogService.close(true, value);
  }

  handleCancel(): void {
    this.dialogService.close(false);
  }
}