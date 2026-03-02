import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormArray, FormControl, ReactiveFormsModule, FormArrayName } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormInput } from '../form-input/form-input';
import { Button } from '../button/button';

@Component({
  selector: 'jwpaisley-form-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconButton, MatIconModule, FormInput, Button],
  templateUrl: './form-list.html',
  styleUrl: './form-list.scss'
})
export class FormList {
  @Input({ required: true }) formListName!: string;
  @Input() label: string = '';
  @Input() type: 'text' | 'number' = 'text';
  @Input() disabled: boolean = false;

  private container = inject(ControlContainer);

  get formArray(): FormArray {
    const control = this.container.control?.get(this.formListName);
    if (!(control instanceof FormArray)) {
      throw new Error(`FormList: "${this.formListName}" is not a FormArray.`);
    }
    return control;
  }

  get controls() {
    return this.formArray?.controls as FormControl[] || [];
  }

  addItem(): void {
    const val = this.type === 'number' ? 0 : '';
    this.formArray.push(new FormControl(val));
  }

  removeItem(index: number): void {
    this.formArray.removeAt(index);
    this.formArray.markAsDirty();
  }

  moveUp(index: number): void {
    if (index > 0) {
      const control = this.formArray.at(index);
      this.formArray.removeAt(index);
      this.formArray.insert(index - 1, control);
      this.formArray.markAsDirty();
    }
  }

  moveDown(index: number): void {
    if (index < this.formArray.length - 1) {
      const control = this.formArray.at(index);
      this.formArray.removeAt(index);
      this.formArray.insert(index + 1, control);
      this.formArray.markAsDirty();
    }
  }
}