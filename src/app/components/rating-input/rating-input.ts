import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RatingState } from '../rating-state/rating-state';

@Component({
  selector: 'jwpaisley-rating-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RatingState],
  templateUrl: './rating-input.html',
  styleUrl: './rating-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingInput),
      multi: true
    }
  ]
})
export class RatingInput implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;

  value: number = 0;
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void { this.value = value || 0; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  handleInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.value = val;
    this.onChange(val);
  }
}