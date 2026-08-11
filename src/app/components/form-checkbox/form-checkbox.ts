import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jwpaisley-form-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckbox),
      multi: true,
    },
  ],
})
export class FormCheckbox implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  value = false;
  disabled = false;
  protected readonly inputId = `form-checkbox-${Math.random().toString(36).slice(2, 10)}`;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = Boolean(value);
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

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const nextValue = target.checked;

    this.value = nextValue;
    this.onChange(nextValue);
    this.onTouched();
  }
}
