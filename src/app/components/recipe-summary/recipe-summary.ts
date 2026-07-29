import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Recipe } from '../../services/recipe-service/recipe-service';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormTextArea } from '../form-text-area/form-text-area';
import { Tag, TagComponent } from '../tag/tag';
import { FormTagsListComponent } from '../form-tags-list/form-tags-list';

@Component({
  selector: 'jwpaisley-recipe-summary',
  standalone: true,
  imports: [AsyncPipe, LayoutModule, Button, FormInput, FormTextArea, ReactiveFormsModule, TagComponent, FormTagsListComponent],
  templateUrl: './recipe-summary.html',
  styleUrls: ['./recipe-summary.scss']
})
export class RecipeSummary {
  @Input({ required: true }) recipe!: Recipe;
  @Input() editMode = false;
  @Input() isUserAdmin = false;
  @Input() isNewRecipe = false;
  @Input() formGroup!: FormGroup;
  @Input() availableTags: Array<Tag> = [];
  @Input() selectedTagIds: string[] = [];
  @Output() editButtonClicked = new EventEmitter<void>();
  @Output() changeEmojiButtonClicked = new EventEmitter<void>();
  @Output() saveButtonClicked = new EventEmitter<void>();
  @Output() cancelButtonClicked = new EventEmitter<void>();
  @Output() deleteButtonClicked = new EventEmitter<void>();
  @Output() tagsChanged = new EventEmitter<string[]>();

  protected get formEmoji(): string {
    return this.formGroup.get('emoji')?.value || '🍲';
  }

  protected get selectedRecipeTags(): Array<{ id: string; title: string; selected: boolean }> {
    const selectedTagIds = this.selectedTagIds ?? [];
    return this.availableTags.filter((tag) => selectedTagIds.includes(tag.id));
  }

  private breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

  protected onTagsChanged(tagIds: string[]): void {
    this.selectedTagIds = tagIds;
    this.formGroup.patchValue({ recipeTags: tagIds });
    this.tagsChanged.emit(tagIds);
  }
}