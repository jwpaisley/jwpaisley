import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jwpaisley-form-radio-button-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-radio-button-group.html',
  styleUrl: './form-radio-button-group.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadioButtonGroup),
      multi: true
    }
  ]
})
export class FormRadioButtonGroup implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';

  selectedValue: any = null;
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void { this.selectedValue = value; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  selectValue(value: any): void {
    if (!this.disabled) {
      this.selectedValue = value;
      this.onChange(value);
      this.onTouched();
    }
  }
}