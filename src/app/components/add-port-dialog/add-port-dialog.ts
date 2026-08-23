import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { FormTextArea } from '../form-text-area/form-text-area';

export interface AddPortDialogData {
  name: string;
  latitude: number | null;
  longitude: number | null;
}

@Component({
  selector: 'jwpaisley-add-port-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button, FormInput, ReactiveFormsModule],
  templateUrl: './add-port-dialog.html',
  styleUrl: './add-port-dialog.scss',
})
export class AddPortDialog {
  @Input() icon = 'directions_boat';
  @Input() title = 'add sailing port';
  @Input() text = 'add a port name and coordinates. stormglass uses latitude and longitude to fetch marine conditions.';
  @Input() confirmLabel = 'save port';
  @Input() cancelLabel = 'cancel';

  @Output() confirm = new EventEmitter<AddPortDialogData>();
  @Output() cancel = new EventEmitter<void>();

  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    latitude: new FormControl<number | null>(null, [Validators.required]),
    longitude: new FormControl<number | null>(null, [Validators.required]),
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
      latitude: rawValue.latitude != null ? Number(rawValue.latitude) : null,
      longitude: rawValue.longitude != null ? Number(rawValue.longitude) : null,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
