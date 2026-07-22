import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FormImageUploadValue {
  name: string;
  url: string;
}

@Component({
  selector: 'jwpaisley-form-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  value: FormImageUploadValue[] = [];
  disabled = false;
  fileInputId = `form-image-upload-${Math.random().toString(36).slice(2)}`;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = Array.isArray(value) ? value : [];
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

    const nextImages = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    this.value = [...this.value, ...nextImages];
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
    if (this.disabled) {
      return;
    }

    const input = document.getElementById(this.fileInputId) as HTMLInputElement | null;
    input?.click();
  }
}
