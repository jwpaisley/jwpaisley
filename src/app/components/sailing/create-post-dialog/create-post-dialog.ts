import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../button/button';
import { FormInput } from '../../form-input/form-input';
import { FormSelect } from '../../form-select/form-select';
import { FormTextArea } from '../../form-text-area/form-text-area';
import { PostStatus, PostType } from '../../../services/posts-service/posts-service';

export interface CreatePostDialogData {
  description: string;
  coverPhotoUrl?: string | null;
  type: PostType;
  content: string;
  status: PostStatus;
}

const postTypeOptions = [
  { label: 'sailing', value: 'sailing' },
  { label: 'movie review', value: 'movie_review' },
  { label: 'hikes', value: 'hikes' },
  { label: 'worldbuilding', value: 'worldbuilding' },
  { label: 'writing', value: 'writing' },
] as const;

const postStatusOptions = [
  { label: 'draft', value: 'draft' },
  { label: 'published', value: 'published' },
  { label: 'archived', value: 'archived' },
] as const;

@Component({
  selector: 'jwpaisley-create-post-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, Button, FormInput, FormSelect, FormTextArea],
  templateUrl: './create-post-dialog.html',
  styleUrl: './create-post-dialog.scss',
})
export class CreatePostDialog {
  @Input() icon = 'article';
  @Input() title = 'create post';
  @Input() text = 'add a new post and save it when ready.';
  @Input() confirmLabel = 'save post';
  @Input() cancelLabel = 'cancel';

  @Output() confirm = new EventEmitter<CreatePostDialogData>();
  @Output() cancel = new EventEmitter<void>();

  protected readonly postTypeOptions = [...postTypeOptions];
  protected readonly postStatusOptions = [...postStatusOptions];

  protected readonly formGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    coverPhotoUrl: new FormControl(''),
    type: new FormControl<PostType | ''>('sailing', [Validators.required]),
    content: new FormControl('', [Validators.required, Validators.minLength(1)]),
    status: new FormControl<PostStatus | ''>('draft', [Validators.required]),
  });

  get enableConfirmButton(): boolean {
    return this.formGroup.valid;
  }

  onConfirm(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const rawValue = this.formGroup.getRawValue();
    const type = rawValue.type as PostType;
    const status = rawValue.status as PostStatus;

    this.confirm.emit({
      description: rawValue.description?.trim() ?? '',
      coverPhotoUrl: rawValue.coverPhotoUrl?.trim() || null,
      type,
      content: rawValue.content?.trim() ?? '',
      status,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
