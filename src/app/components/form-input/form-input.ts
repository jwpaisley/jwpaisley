import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jwpaisley-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: 'text' | 'number' = 'text';
  protected readonly inputId = `form-input-${Math.random().toString(36).slice(2, 10)}`;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() placeholder: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';

  value: any = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void { this.value = value; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = this.type === 'number' ? 
      (target.value === '' ? null : parseFloat(target.value)) : 
      target.value;
    
    this.value = val;
    this.onChange(val);
  }
}