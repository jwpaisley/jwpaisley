import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';

export interface AddSailboatDialogData {
  name: string;
  make?: string | null;
  model?: string | null;
  homePort?: string | null;
}

@Component({
  selector: 'jwpaisley-add-sailboat-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, Button, FormInput],
  templateUrl: './add-sailboat-dialog.html',
  styleUrl: './add-sailboat-dialog.scss',
})
export class AddSailboatDialog {
  @Input() icon = 'directions_boat';
  @Input() title = 'add sailboat';
  @Input() text = 'add the core details for a new sailboat and save it for later review.';
  @Input() confirmLabel = 'save sailboat';
  @Input() cancelLabel = 'cancel';

  @Output() confirm = new EventEmitter<AddSailboatDialogData>();
  @Output() cancel = new EventEmitter<void>();

  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    make: new FormControl(''),
    model: new FormControl(''),
    homePort: new FormControl(''),
  });

  get enableConfirmButton(): boolean {
    return this.formGroup.valid;
  }

  onConfirm(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const rawValue = this.formGroup.getRawValue();

    this.confirm.emit({
      name: rawValue.name?.trim() ?? '',
      make: rawValue.make?.trim() || null,
      model: rawValue.model?.trim() || null,
      homePort: rawValue.homePort?.trim() || null,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
