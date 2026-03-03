import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';

@Component({
  selector: 'jwpaisley-emoji-picker-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button, FormInput, ReactiveFormsModule],
  templateUrl: './emoji-picker-dialog.html',
  styleUrl: './emoji-picker-dialog.scss'
})
export class EmojiPickerDialog {
  @Input() icon: string = 'mood';
  @Input() title: string = 'select an emoji';
  @Input() text: string = 'choose an emoji to represent your recipe';
  @Input() confirmLabel: string = 'use emoji';
  @Input() cancelLabel: string = 'cancel';
  @Input() value: string = '🍲';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  protected formGroup: FormGroup = new FormGroup({
    emoji: new FormControl(this.value, [Validators.required, Validators.minLength(1)])
  });

  get enableConfirmButton(): boolean {
    return this.formGroup.valid;
  }

  onConfirm() {
    const value = this.formGroup.get('emoji')?.value;
    this.confirm.emit(value);
  }

  onCancel() {
    this.cancel.emit();
  }
}