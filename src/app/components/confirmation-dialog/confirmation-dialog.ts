import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../button/button';

@Component({
  selector: 'jwpaisley-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss'
})
export class ConfirmationDialog {
  @Input() icon: string = 'help_outline';
  @Input() title: string = 'Are you sure?';
  @Input() text: string = 'This action cannot be undone.';
  @Input() confirmLabel: string = 'confirm';
  @Input() cancelLabel: string = 'cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}