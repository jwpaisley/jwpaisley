import { Component, EventEmitter, Input, Output, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TagComponent, Tag } from '../tag/tag';
import { DialogService } from '../../services/dialog-service/dialog-service';

@Component({
  selector: 'jwpaisley-form-tags-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, TagComponent],
  templateUrl: './form-tags-list.html',
  styleUrl: './form-tags-list.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTagsListComponent),
      multi: true,
    },
  ],
})
export class FormTagsListComponent implements ControlValueAccessor {
  @Input() tags: Tag[] = [];
  @Input() placeholder = '+ new tag';
  @Output() tagSelected = new EventEmitter<string>();
  @Output() tagUnselected = new EventEmitter<string>();
  @Output() addTagClicked = new EventEmitter<void>();

  protected value: string[] = [];
  protected disabled = false;
  protected onChange: any = () => {};
  private dialogService = inject(DialogService);
  protected onTouched: any = () => {};

  writeValue(value: string[] | null | undefined): void {
    this.value = value ?? [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected get selectedTags(): Tag[] {
    return this.tags.filter((tag) => this.value.includes(tag.id));
  }

  protected get unselectedTags(): Tag[] {
    return this.tags.filter((tag) => !this.value.includes(tag.id));
  }

  protected onTagSelect(tagId: string): void {
    if (this.disabled) {
      return;
    }

    const nextValue = this.value.includes(tagId) ? this.value : [...this.value, tagId];
    this.value = nextValue;
    this.onChange(nextValue);
    this.onTouched();
    this.tagSelected.emit(tagId);
  }

  protected onTagUnselect(tagId: string): void {
    if (this.disabled) {
      return;
    }

    const nextValue = this.value.filter((currentTagId) => currentTagId !== tagId);
    this.value = nextValue;
    this.onChange(nextValue);
    this.onTouched();
    this.tagUnselected.emit(tagId);
  }

  protected async onAddTagClick(): Promise<void> {
    if (this.disabled) {
      return;
    }

    const result = await this.dialogService.openTagSelectorDialog({
      title: 'select tags',
      value: {
        availableTags: this.tags,
        selectedTagIds: this.value,
      },
    });

    if (result.confirmed && Array.isArray(result.value)) {
      this.value = result.value;
      this.onChange(result.value);
      this.onTouched();
      this.addTagClicked.emit();
    }
  }
}
