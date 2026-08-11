import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../button/button';
import { FormCheckbox } from '../../form-checkbox/form-checkbox';
import { FormImageUpload, FormImageUploadValue } from '../../form-image-upload/form-image-upload';
import { FormTextArea } from '../../form-text-area/form-text-area';

export interface AddSailboatPhotoDialogData {
  file: File;
  caption: string;
  showInCarousel: boolean;
}

@Component({
  selector: 'jwpaisley-add-sailboat-photo-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, Button, FormImageUpload, FormTextArea, FormCheckbox],
  templateUrl: './add-sailboat-photo-dialog.html',
  styleUrl: './add-sailboat-photo-dialog.scss',
})
export class AddSailboatPhotoDialog {
  caption = '';
  showInCarousel = false;
  selectedImages: FormImageUploadValue[] = [];

  @Output() confirm = new EventEmitter<AddSailboatPhotoDialogData>();
  @Output() cancel = new EventEmitter<void>();

  get isConfirmDisabled(): boolean {
    return !this.selectedImages.some((image) => !!image.file);
  }

  onCaptionChange(value: string): void {
    this.caption = value;
  }

  onImagesChange(images: FormImageUploadValue[]): void {
    this.selectedImages = images;
  }

  onConfirm(): void {
    const selectedFile = this.selectedImages.find((image) => !!image.file)?.file;

    if (!selectedFile) {
      return;
    }

    this.confirm.emit({
      file: selectedFile,
      caption: this.caption,
      showInCarousel: this.showInCarousel,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
