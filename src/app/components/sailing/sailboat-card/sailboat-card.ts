import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sailboat } from '../../../services/sailboat-service/sailboat-service';

@Component({
  selector: 'jwpaisley-sailboat-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sailboat-card.html',
  styleUrl: './sailboat-card.scss',
})
export class SailboatCard {
  @Input() boat!: Sailboat;

  get makeModel(): string {
    const parts = [this.boat?.make, this.boat?.model].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'details pending';
  }

  get ensignFlagUrl(): string {
    return this.boat?.privateEnsignFlagUrl?.trim() ?? '';
  }

  get hullDescription(): string {
    const parts = [this.boat?.hullMaterial, this.boat?.hullType].filter(Boolean);
    return parts.length > 0 ? parts.join(' / ') : 'n/a';
  }

  get lengthDisplay(): string {
    return this.formatFeetAndInches(this.boat?.loa);
  }

  get beamDisplay(): string {
    return this.formatFeetAndInches(this.boat?.beamFt);
  }

  get displacementDisplay(): string {
    return this.formatWeight(this.boat?.displacementWeight);
  }

  get ballastDisplay(): string {
    return this.formatWeight(this.boat?.ballastWeight);
  }

  private formatFeetAndInches(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return 'n/a';
    }

    const totalInches = Math.round(value * 12);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;

    if (inches === 0) {
      return `${feet}'`;
    }

    return `${feet}'${inches}"`;
  }

  private formatWeight(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return 'n/a';
    }

    return `${value.toLocaleString()} lbs`;
  }
}
