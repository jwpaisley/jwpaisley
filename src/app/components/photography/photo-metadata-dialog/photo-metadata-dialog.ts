import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../button/button';
import { FormInput } from '../../form-input/form-input';
import { FormImageUploadValue } from '../../form-image-upload/form-image-upload';
import { PhotoService } from '../../../services/photo-service/photo-service';

export interface PhotoMetadataDialogData {
  caption: string;
  location: string;
  takenDate: string;
}

@Component({
  selector: 'jwpaisley-photo-metadata-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, Button, FormInput],
  templateUrl: './photo-metadata-dialog.html',
  styleUrl: './photo-metadata-dialog.scss',
})
export class PhotoMetadataDialog {
  caption = '';
  location = '';
  takenDate = '';

  @Input() image: FormImageUploadValue | null = null;
  @Output() confirm = new EventEmitter<PhotoMetadataDialogData>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private photoService: PhotoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    if (!this.image) {
      return;
    }

    const hasMetadata = Boolean(this.image.caption || this.image.location || this.image.takenDate);
    if (this.image.id && !hasMetadata) {
      this.fetchPhotoMetadata(this.image.id);
      return;
    }

    this.applyImageMetadata(this.image);
  }

  private applyImageMetadata(image: FormImageUploadValue): void {
    this.caption = image.caption ?? '';
    this.location = image.location ?? '';
    this.takenDate = image.takenDate ?? '';
    this.cdr.detectChanges();
  }

  private fetchPhotoMetadata(photoId: string): void {
    this.photoService.getPhoto(photoId).subscribe({
      next: (photo) => {
        this.applyImageMetadata({
          name: this.image?.name ?? photo.caption ?? 'photo',
          url: this.image?.url ?? photo.image,
          caption: photo.caption,
          location: photo.location,
          takenDate: photo.takenDate,
          id: photo.id,
          collection: photo.collection,
          image: photo.image,
        });
      },
      error: () => {
        this.applyImageMetadata(this.image ?? { name: '', url: '' });
      },
    });
  }

  onCaptionChange(value: string): void {
    this.caption = value;
  }

  onLocationChange(value: string): void {
    this.location = value;
  }

  onTakenDateChange(value: string): void {
    this.takenDate = value;
  }

  onConfirm(): void {
    this.confirm.emit({
      caption: this.caption,
      location: this.location,
      takenDate: this.takenDate,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
