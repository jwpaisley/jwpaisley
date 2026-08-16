import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SportsPredictionFixture } from '../../../services/sports-prediction-service/sports-prediction-service';

@Component({
  selector: 'jwpaisley-fixture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture.html',
  styleUrl: './fixture.scss',
})
export class Fixture {
  @Input({ required: true }) fixture!: SportsPredictionFixture;
  @Input() teamNameById: Record<string, string> = {};
  @Input() teamLogoById: Record<string, string> = {};

  get isPastGameWithResult(): boolean {
    return this.hasResult() && this.isPastGame();
  }

  get homeResultState(): 'correct' | 'incorrect' {
    return this.getResultOutcome() === 'home' ? 'correct' : 'incorrect';
  }

  get drawResultState(): 'correct' | 'incorrect' {
    return this.getResultOutcome() === 'draw' ? 'correct' : 'incorrect';
  }

  get awayResultState(): 'correct' | 'incorrect' {
    return this.getResultOutcome() === 'away' ? 'correct' : 'incorrect';
  }

  get homeTeamLabel(): string {
    return this.teamNameById[this.fixture.homeTeamId] ?? this.fixture.homeTeamId;
  }

  get awayTeamLabel(): string {
    return this.teamNameById[this.fixture.awayTeamId] ?? this.fixture.awayTeamId;
  }

  get homeTeamLogoUrl(): string | null {
    return this.teamLogoById[this.fixture.homeTeamId] ?? null;
  }

  get awayTeamLogoUrl(): string | null {
    return this.teamLogoById[this.fixture.awayTeamId] ?? null;
  }

  get homeTeamInitial(): string {
    return this.getTeamInitial(this.homeTeamLabel);
  }

  get awayTeamInitial(): string {
    return this.getTeamInitial(this.awayTeamLabel);
  }

  get displayHomeOdds(): string {
    return this.formatOdds(this.fixture.homeOdds);
  }

  get displayDrawOdds(): string {
    return this.formatOdds(this.fixture.drawOdds);
  }

  get displayAwayOdds(): string {
    return this.formatOdds(this.fixture.awayOdds);
  }

  get displayResultLabel(): string {
    const outcome = this.getResultOutcome();

    switch (outcome) {
      case 'home':
        return 'home win';
      case 'draw':
        return 'draw';
      case 'away':
        return 'away win';
      default:
        return 'result';
    }
  }

  private hasResult(): boolean {
    return this.fixture.homeScore != null && this.fixture.awayScore != null;
  }

  private isPastGame(): boolean {
    if (this.fixture.status && ['FINISHED', 'IN_PROGRESS'].includes(this.fixture.status.toUpperCase())) {
      return true;
    }

    if (!this.fixture.commenceTime) {
      return false;
    }

    const commenceTime = new Date(this.fixture.commenceTime).getTime();
    return !Number.isNaN(commenceTime) && commenceTime < Date.now();
  }

  private getResultOutcome(): 'home' | 'draw' | 'away' | null {
    if (!this.hasResult()) {
      return null;
    }

    const homeScore = this.fixture.homeScore ?? 0;
    const awayScore = this.fixture.awayScore ?? 0;

    if (homeScore > awayScore) {
      return 'home';
    }

    if (awayScore > homeScore) {
      return 'away';
    }

    return 'draw';
  }

  formatDate(value?: string | null): string {
    if (!value) {
      return 'tbd';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'tbd';
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  }

  private formatOdds(value?: number | null): string {
    return value == null ? '-' : value.toFixed(2);
  }

  private getTeamInitial(label: string): string {
    if (!label) {
      return '?';
    }

    return label.trim().charAt(0).toUpperCase() || '?';
  }
}
