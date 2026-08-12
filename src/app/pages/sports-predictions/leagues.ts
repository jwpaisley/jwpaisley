import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EmptyState } from '../../components/empty-state/empty-state';
import { Loader } from '../../components/loader/loader';
import { SportsPredictionLeague, SportsPredictionService } from '../../services/sports-prediction-service/sports-prediction-service';

@Component({
  selector: 'jwpaisley-sports-predictions-leagues',
  standalone: true,
  imports: [CommonModule, Loader, EmptyState],
  template: `
    <div class="section-header">
      <h2 class="section-title">leagues</h2>
      <jwpaisley-loader [isLoading]="isLoading">
        @if (leagues.length === 0) {
          <jwpaisley-empty-state
            emoji="⚽"
            title="no leagues to display"
            subtitle="when there are leagues to display, they will appear here"
          ></jwpaisley-empty-state>
        } @else {
          <div class="league-list">
            @for (league of leagues; track league.id) {
              <h4 class="league-name">{{ league.name }}</h4>
            }
          </div>
        }
      </jwpaisley-loader>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }

      .section-header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .section-title {
        margin: 0;
        text-transform: lowercase;
      }

      .league-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .league-name {
        margin: 0;
      }
    `,
  ],
})
export class SportsPredictionLeaguesPage implements OnInit {
  private readonly sportsPredictionService = inject(SportsPredictionService);

  leagues: SportsPredictionLeague[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.sportsPredictionService.getLeagues().subscribe({
      next: (leagues) => {
        this.leagues = leagues;
        this.isLoading = false;
      },
      error: () => {
        this.leagues = [];
        this.isLoading = false;
      },
    });
  }
}
