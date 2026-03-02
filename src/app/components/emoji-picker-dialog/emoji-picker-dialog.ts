import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInput } from '../form-input/form-input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jwpaisley-emoji-picker-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput],
  templateUrl: './emoji-picker-dialog.html',
  styleUrl: './emoji-picker-dialog.scss'
})
export class EmojiPickerDialog {
  @Output() select = new EventEmitter<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length > 0) {
      this.select.emit(value[0]);
    }
  }
}