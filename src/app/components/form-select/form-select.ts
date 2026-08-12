import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FormSelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'jwpaisley-form-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelect),
      multi: true,
    },
  ],
})
export class FormSelect implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'select an option';
  @Input() options: FormSelectOption[] = [];
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  value: string = '';
  disabled = false;
  protected readonly inputId = `form-select-${Math.random().toString(36).slice(2, 10)}`;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
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
    const target = event.target as HTMLSelectElement;
    const nextValue = target.value;

    this.value = nextValue;
    this.onChange(nextValue);
    this.onTouched();
  }
}
