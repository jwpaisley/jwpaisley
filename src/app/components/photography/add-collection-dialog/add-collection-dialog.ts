import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../button/button';
import { FormInput } from '../../form-input/form-input';
import { FormTextArea } from '../../form-text-area/form-text-area';
import { FormImageUpload, FormImageUploadValue } from '../../form-image-upload/form-image-upload';
import { Photo, PhotoCollection } from '../../../services/photo-service/photo-service';

export interface AddCollectionDialogData {
  title: string;
  description: string;
  location: string;
  images: FormImageUploadValue[];
}

export type CollectionDialogMode = 'create' | 'edit';

@Component({
  selector: 'jwpaisley-add-collection-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, Button, FormInput, FormTextArea, FormImageUpload],
  templateUrl: './add-collection-dialog.html',
  styleUrl: './add-collection-dialog.scss',
})
export class AddCollectionDialog {
  title = '';
  description = '';
  location = '';
  images: FormImageUploadValue[] = [];

  @Input() mode: CollectionDialogMode = 'create';
  @Input() collection: PhotoCollection | null = null;
  @Input() photos: Photo[] = [];

  @Output() confirm = new EventEmitter<AddCollectionDialogData>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.mode === 'edit' && this.collection) {
      this.title = this.collection.title || '';
      this.description = this.collection.caption || '';
      this.location = this.collection.location || '';
      this.images = this.photos.map((photo) => ({
        name: photo.caption || 'photo',
        url: photo.image,
      }));
    }
  }

  get disableCreateButton(): boolean {
    return !this.title.trim() || !this.description.trim() || !this.location.trim() || this.images.length === 0;
  }

  get dialogTitle(): string {
    return this.mode === 'edit' ? 'edit collection' : 'create collection';
  }

  get confirmLabel(): string {
    return this.mode === 'edit' ? 'save changes' : 'create';
  }

  onTitleChange(value: string): void {
    this.title = value;
  }

  onDescriptionChange(value: string): void {
    this.description = value;
  }

  onLocationChange(value: string): void {
    this.location = value;
  }

  onImagesChange(value: FormImageUploadValue[]): void {
    this.images = value;
  }

  onConfirm(): void {
    if (this.disableCreateButton) {
      return;
    }

    this.confirm.emit({
      title: this.title,
      description: this.description,
      location: this.location,
      images: this.images,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
