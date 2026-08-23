import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum MarineConditionLevel {
  // Peak / Optimal
  IDEAL = 'IDEAL',             // Perfect sailing breeze (10–18 kts), flat/moderate chop, full control

  // Flanks / Moderate Conditions
  GOOD = 'GOOD',               // Solid sailing conditions, manageable wind/sea state
  LIGHT_AIRS = 'LIGHT_AIRS',   // Underpowered (4–8 kts), slow going, requires light-air tactics
  LIGHT = 'LIGHT',             // 8–10 kts, pleasant cruising, low pressure

  // Sub-Optimal / Frustrating
  CALM = 'CALM',               // < 4 kts, glass/doldrums, motoring required

  // Elevated Wind & Sea State
  BRISK = 'BRISK',             // 18–22 kts, heavy chop, time to reef mainsail / depower
  CHALLENGING = 'CHALLENGING', // 22–28 kts, steep waves, active helm & experienced crew needed

  // Hazardous / Risk Levels
  CAUTION = 'CAUTION',         // Small Craft Advisory territory, heavy weather precautions
  HAZARDOUS = 'HAZARDOUS',     // Gale force / extreme sea state, high risk of equipment failure or knockdown
  DANGEROUS = 'DANGEROUS',     // Storm conditions / extreme risk to vessel and crew, seek shelter
}

export interface SailingConditionsCardData {
  id: string;
  location: string;
  title: string;
  condition: MarineConditionLevel;
  windDirection: string;
  windSpeed: number;
  currentSpeed: number | null;
  currentDirection: string;
  gusts: number;
  waveHeight: string;
  waterTemp: number | null;
  visibility: string;
  forecast: string;
  time: string;
}

@Component({
  selector: 'jwpaisley-sailing-conditions-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sailing-conditions-card.html',
  styleUrl: './sailing-conditions-card.scss',
})
export class SailingConditionsCard {
  @Input() card!: SailingConditionsCardData;

  get conditionClass(): string {
    switch (this.card?.condition) {
      case MarineConditionLevel.IDEAL:
        return 'condition-ideal';
      case MarineConditionLevel.GOOD:
        return 'condition-good';
      case MarineConditionLevel.LIGHT_AIRS:
        return 'condition-light-airs';
      case MarineConditionLevel.LIGHT:
        return 'condition-light';
      case MarineConditionLevel.CALM:
        return 'condition-calm';
      case MarineConditionLevel.BRISK:
        return 'condition-brisk';
      case MarineConditionLevel.CHALLENGING:
        return 'condition-challenging';
      case MarineConditionLevel.CAUTION:
        return 'condition-caution';
      case MarineConditionLevel.HAZARDOUS:
        return 'condition-hazardous';
      case MarineConditionLevel.DANGEROUS:
        return 'condition-dangerous';
      default:
        return 'condition-ideal';
    }
  }

  get conditionLabel(): string {
    return this.formatConditionLabel(this.card?.condition);
  }

  private formatConditionLabel(value: unknown): string {
    const rawValue = value == null ? '' : String(value);

    if (!rawValue) {
      return '';
    }

    return rawValue
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
