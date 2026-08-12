import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SportsPredictionLeague } from '../../../services/sports-prediction-service/sports-prediction-service';

@Component({
  selector: 'jwpaisley-sports-prediction-league-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './league-card.html',
  styleUrl: './league-card.scss',
})
export class LeagueCard {
  @Input() league!: SportsPredictionLeague;
  @Input() participantCount = 0;
  @Input() currentLeader: string | null = '-';

  formatDate(value?: string | null): string {
    if (!value) {
      return 'n/a';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'n/a';
    }

    const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }).toLowerCase();
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month} ${day}${this.getOrdinal(day)}, ${year}`;
  }

  private getOrdinal(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }

    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
