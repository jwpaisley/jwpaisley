import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { FormTextArea } from '../form-text-area/form-text-area';

@Component({
  selector: 'jwpaisley-add-recipe-tag-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button, FormInput, FormTextArea, ReactiveFormsModule],
  templateUrl: './add-recipe-tag-dialog.html',
  styleUrl: './add-recipe-tag-dialog.scss',
})
export class AddRecipeTagDialog {
  @Input() icon = 'sell';
  @Input() title = 'create recipe tag';
  @Input() text = 'add a reusable tag that can be attached to recipes.';
  @Input() confirmLabel = 'create tag';
  @Input() cancelLabel = 'cancel';

  @Output() confirm = new EventEmitter<{ name: string; description?: string | null }>();
  @Output() cancel = new EventEmitter<void>();

  protected formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl(''),
  });

  get enableConfirmButton(): boolean {
    return this.formGroup.valid;
  }

  onConfirm(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const name = this.formGroup.get('name')?.value?.trim() ?? '';
    const description = this.formGroup.get('description')?.value?.trim() || null;

    this.confirm.emit({ name, description });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
