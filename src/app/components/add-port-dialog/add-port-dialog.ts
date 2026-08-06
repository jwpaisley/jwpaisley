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
  tideStationId?: string | null;
  currentStationId?: string | null;
  buoyStationId?: string | null;
  nwsOffice?: string | null;
  nwsGridX?: number | null;
  nwsGridY?: number | null;
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
  @Input() text = 'add the details for a new port and save it for later review.';
  @Input() confirmLabel = 'save port';
  @Input() cancelLabel = 'cancel';

  @Output() confirm = new EventEmitter<AddPortDialogData>();
  @Output() cancel = new EventEmitter<void>();

  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    latitude: new FormControl<number | null>(null, [Validators.required]),
    longitude: new FormControl<number | null>(null, [Validators.required]),
    tideStationId: new FormControl(''),
    currentStationId: new FormControl(''),
    buoyStationId: new FormControl(''),
    nwsOffice: new FormControl(''),
    nwsGridX: new FormControl<number | null>(null),
    nwsGridY: new FormControl<number | null>(null),
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
      tideStationId: rawValue.tideStationId?.trim() || null,
      currentStationId: rawValue.currentStationId?.trim() || null,
      buoyStationId: rawValue.buoyStationId?.trim() || null,
      nwsOffice: rawValue.nwsOffice?.trim() || null,
      nwsGridX: rawValue.nwsGridX != null ? Number(rawValue.nwsGridX) : null,
      nwsGridY: rawValue.nwsGridY != null ? Number(rawValue.nwsGridY) : null,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
