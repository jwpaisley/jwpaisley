import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PostStatus, PostType, PostsService } from '../../../services/posts-service/posts-service';
import { Button } from '../../button/button';
import { FormInput } from '../../form-input/form-input';
import { FormSelect } from '../../form-select/form-select';
import { MarkdownInput } from '../../markdown-input/markdown-input';

export interface CreatePostDialogData {
  title: string;
  description: string;
  coverPhotoUrl?: string | null;
  type: PostType;
  content: string;
  status: PostStatus;
}

export interface PostDialogValue extends Partial<CreatePostDialogData> {
  id?: string;
  defaultType?: PostType;
}

const postTypeOptions = [
  { label: 'sailing', value: 'sailing' },
  { label: 'movie review', value: 'movie_review' },
  { label: 'hikes', value: 'hikes' },
  { label: 'worldbuilding', value: 'worldbuilding' },
  { label: 'writing', value: 'writing' },
] as const;

const postStatusOptions = [
  { label: 'draft', value: 'DRAFT' },
  { label: 'published', value: 'PUBLISHED' },
  { label: 'archived', value: 'ARCHIVED' },
] as const;

@Component({
  selector: 'jwpaisley-add-post-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, Button, FormInput, FormSelect, MarkdownInput],
  templateUrl: './add-post-dialog.html',
  styleUrl: './add-post-dialog.scss',
})
export class AddPostDialog implements OnInit {
  @Input() icon = 'article';
  @Input() title = 'create post';
  @Input() text = 'add a new post and save it when ready.';
  @Input() confirmLabel = 'save post';
  @Input() cancelLabel = 'cancel';
  @Input() defaultType: PostType = 'sailing';
  @Input() existingPost: (Partial<CreatePostDialogData> & { id?: string }) | null = null;

  @Output() confirm = new EventEmitter<CreatePostDialogData>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(MarkdownInput) private markdownInput?: MarkdownInput;

  protected readonly postTypeOptions = [...postTypeOptions];
  protected readonly postStatusOptions = [...postStatusOptions];

  protected readonly formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    coverPhotoUrl: new FormControl(''),
    type: new FormControl<PostType | ''>('sailing', [Validators.required]),
    content: new FormControl('', [Validators.required, Validators.minLength(1)]),
    status: new FormControl<PostStatus | ''>('DRAFT', [Validators.required]),
  });

  constructor(private readonly postsService: PostsService) {}

  ngOnInit(): void {
    const values = this.existingPost ?? {};

    this.formGroup.patchValue({
      title: values.title ?? '',
      description: values.description ?? '',
      coverPhotoUrl: values.coverPhotoUrl ?? '',
      type: values.type ?? this.defaultType,
      content: values.content ?? '',
      status: values.status ?? 'DRAFT',
    });
  }

  get enableConfirmButton(): boolean {
    return this.formGroup.valid;
  }

  triggerCoverUpload(): void {
    const input = document.getElementById('create-post-cover-upload-input') as HTMLInputElement | null;
    input?.click();
  }

  triggerMarkdownImageUpload(): void {
    const input = document.getElementById('create-post-markdown-upload-input') as HTMLInputElement | null;
    input?.click();
  }

  onCoverPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.postsService.uploadPostCover(file).subscribe({
      next: (response: { url: string }) => {
        this.formGroup.patchValue({ coverPhotoUrl: response.url });
      },
      error: () => {
        input.value = '';
      },
      complete: () => {
        input.value = '';
      },
    });
  }

  onMarkdownImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.postsService.uploadPostMedia(file).subscribe({
      next: (response: { url: string }) => {
        this.markdownInput?.insertMarkdownImage(response.url);
      },
      error: () => {
        input.value = '';
      },
      complete: () => {
        input.value = '';
      },
    });
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
      title: rawValue.title?.trim() ?? '',
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
