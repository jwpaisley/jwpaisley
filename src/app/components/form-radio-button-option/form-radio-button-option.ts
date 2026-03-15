import { Component, Input, HostListener, Optional, Inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRadioButtonGroup } from '../form-radio-button-group/form-radio-button-group';

@Component({
  selector: 'jwpaisley-form-radio-button-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-radio-button-option.html',
  styleUrl: './form-radio-button-option.scss'
})
export class FormRadioButtonOption {
  @Input() value: any;
  @Input() disabled: boolean = false;

  constructor(@Optional() public parent: FormRadioButtonGroup) {}

  get isSelected(): boolean {
    return this.parent?.selectedValue === this.value;
  }

  @HostListener('click')
  onSelect() {
    if (this.parent) {
      this.parent.selectValue(this.value);
    }
  }
}