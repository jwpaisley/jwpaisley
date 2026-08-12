import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../button/button';
import { FormCheckbox } from '../../form-checkbox/form-checkbox';
import { FormInput } from '../../form-input/form-input';
import { FormSelect } from '../../form-select/form-select';
import { FormTextArea } from '../../form-text-area/form-text-area';
import { Sport } from '../../../services/sports-prediction-service/sports-prediction-service';

export interface CreateSportsPredictionLeagueDialogData {
  name: string;
  description?: string | null;
  sport: Sport;
  isPrivate: boolean;
  firstPlacePrizeCoins: number;
  secondPlacePrizeCoins: number;
  thirdPlacePrizeCoins: number;
  apiSportsLeagueId: number;
  apiSportsSeasonId: number;
}

const sportOptions = [
  { label: 'Soccer', value: 'SOCCER' },
  { label: 'Football', value: 'FOOTBALL' },
  { label: 'Hockey', value: 'HOCKEY' },
  { label: 'Baseball', value: 'BASEBALL' },
  { label: 'Basketball', value: 'BASKETBALL' },
  { label: 'F1', value: 'F1' },
] as const;

@Component({
  selector: 'jwpaisley-create-sports-prediction-league-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, Button, FormInput, FormTextArea, FormCheckbox, FormSelect],
  templateUrl: './create-sports-prediction-league-dialog.html',
  styleUrl: './create-sports-prediction-league-dialog.scss',
})
export class CreateSportsPredictionLeagueDialog {
  @Input() icon = 'sports_soccer';
  @Input() title = 'create league';
  @Input() text = 'add a new sports prediction league and save it for later play.';
  @Input() confirmLabel = 'create league';
  @Input() cancelLabel = 'cancel';

  @Output() confirm = new EventEmitter<CreateSportsPredictionLeagueDialogData>();
  @Output() cancel = new EventEmitter<void>();

  protected readonly sportOptions = [...sportOptions];

  protected readonly formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl(''),
    sport: new FormControl<Sport | ''>('', [Validators.required]),
    isPrivate: new FormControl(false),
    firstPlacePrizeCoins: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
    secondPlacePrizeCoins: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
    thirdPlacePrizeCoins: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
    apiSportsLeagueId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    apiSportsSeasonId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
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
    const sport = rawValue.sport as Sport;

    this.confirm.emit({
      name: rawValue.name?.trim() ?? '',
      description: rawValue.description?.trim() || null,
      sport,
      isPrivate: Boolean(rawValue.isPrivate),
      firstPlacePrizeCoins: Number(rawValue.firstPlacePrizeCoins ?? 0),
      secondPlacePrizeCoins: Number(rawValue.secondPlacePrizeCoins ?? 0),
      thirdPlacePrizeCoins: Number(rawValue.thirdPlacePrizeCoins ?? 0),
      apiSportsLeagueId: Number(rawValue.apiSportsLeagueId ?? 0),
      apiSportsSeasonId: Number(rawValue.apiSportsSeasonId ?? 0),
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
