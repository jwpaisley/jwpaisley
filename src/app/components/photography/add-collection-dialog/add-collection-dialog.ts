import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../button/button';
import { FormInput } from '../../form-input/form-input';
import { FormTextArea } from '../../form-text-area/form-text-area';
import { FormImageUpload, FormImageUploadValue } from '../../form-image-upload/form-image-upload';

export interface AddCollectionDialogData {
  title: string;
  description: string;
  images: FormImageUploadValue[];
}

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
  images: FormImageUploadValue[] = [];

  @Output() confirm = new EventEmitter<AddCollectionDialogData>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit({
      title: this.title,
      description: this.description,
      images: this.images,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
