import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jwpaisley-form-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-datepicker.html',
  styleUrl: './form-datepicker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatepicker),
      multi: true
    }
  ]
})
export class FormDatepicker implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() placeholder: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';

  value: string = '';
  disabled = false;
  private timeSuffix: string = '00:00:00.000000';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value && typeof value === 'string' && value.includes(' ')) {
      const parts = value.split(' ');
      this.value = parts[0];
      this.timeSuffix = parts[1];
    } else {
      this.value = value || '';
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const datePart = target.value;
    this.value = datePart;

    if (!datePart) {
      this.onChange(null);
      return;
    }

    const fullTimestamp = `${datePart} ${this.timeSuffix}`;
    this.onChange(fullTimestamp);
  }
}