import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface FormImageUploadValue {
  name: string;
  url: string;
  file?: File;
  caption?: string;
  location?: string;
  takenDate?: string;
  id?: string;
  collection?: string;
  image?: string;
}

@Component({
  selector: 'jwpaisley-form-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './form-image-upload.html',
  styleUrl: './form-image-upload.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormImageUpload),
      multi: true,
    },
  ],
})
export class FormImageUpload implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select images';
  @Input() maxImages: number | null = null;
  @Output() imageSelect = new EventEmitter<FormImageUploadValue>();

  value: FormImageUploadValue[] = [];
  disabled = false;
  fileInputId = `form-image-upload-${Math.random().toString(36).slice(2)}`;

  onChange: any = () => {};
  onTouched: any = () => {};

  get isSelectionLimitReached(): boolean {
    const maxImages = this.maxImages != null && this.maxImages > 0 ? this.maxImages : null;
    return maxImages != null ? this.value.length >= maxImages : false;
  }

  private getImageKey(image: FormImageUploadValue): string {
    if (image.file) {
      return `${image.file.name}:${image.file.size}:${image.file.lastModified}`;
    }

    return `${image.url || ''}:${image.name || ''}`;
  }

  private deduplicateImages(images: FormImageUploadValue[]): FormImageUploadValue[] {
    const seen = new Set<string>();

    return images.filter((image) => {
      const key = this.getImageKey(image);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  writeValue(value: any): void {
    this.value = this.deduplicateImages(Array.isArray(value) ? value : []);
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

  handleFileSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (files.length === 0) {
      return;
    }

    const maxImages = this.maxImages != null && this.maxImages > 0 ? this.maxImages : null;
    const remainingSlots = maxImages != null ? Math.max(0, maxImages - this.value.length) : files.length;
    const selectedFiles = files.slice(0, remainingSlots);

    if (selectedFiles.length === 0) {
      input.value = '';
      return;
    }

    const nextImages = selectedFiles
      .map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      }))
      .filter((image) => !this.value.some((existingImage) => this.getImageKey(existingImage) === this.getImageKey(image)));

    this.value = this.deduplicateImages([...this.value, ...nextImages]);
    this.onChange(this.value);
    this.onTouched();
    input.value = '';
  }

  removeImage(index: number): void {
    this.value = this.value.filter((_, imageIndex) => imageIndex !== index);
    this.onChange(this.value);
    this.onTouched();
  }

  triggerPicker(): void {
    if (this.disabled || this.isSelectionLimitReached) {
      return;
    }

    const input = document.getElementById(this.fileInputId) as HTMLInputElement | null;
    input?.click();
  }

  selectImage(image: FormImageUploadValue): void {
    this.imageSelect.emit(image);
  }
}
