import { Component, inject } from '@angular/core';
import { Card } from '../../components/card/card';
import { CardGrid } from '../../components/card-grid/card-grid';
import { UsersTable } from '../../components/users-table/users-table';
import { Button } from '../../components/button/button';
import { SportsPredictionService } from '../../services/sports-prediction-service/sports-prediction-service';
import { ToastService } from '../../services/toast-service/toast-service';

@Component({
  selector: 'jwpaisley-admin',
  imports: [UsersTable, CardGrid, Card, Button],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage {
  private readonly sportsPredictionService = inject(SportsPredictionService);
  private readonly toastService = inject(ToastService);
  protected isSyncingSportsPredictionFixtures = false;
  protected isSettlingSportsPredictionPicks = false;

  protected syncSportsPredictionFixtures(): void {
    if (this.isSyncingSportsPredictionFixtures) {
      return;
    }

    this.isSyncingSportsPredictionFixtures = true;

    this.sportsPredictionService.syncFixturesJob().subscribe({
      next: () => {
        this.isSyncingSportsPredictionFixtures = false;
        this.toastService.addToast('sports predictions fixtures sync started', 'sync', 'info');
      },
      error: () => {
        this.isSyncingSportsPredictionFixtures = false;
        this.toastService.addToast('failed to sync sports predictions fixtures', 'error', 'danger');
      },
    });
  }

  protected settleSportsPredictionPicks(): void {
    if (this.isSettlingSportsPredictionPicks) {
      return;
    }

    this.isSettlingSportsPredictionPicks = true;

    this.sportsPredictionService.settlePicksJob().subscribe({
      next: () => {
        this.isSettlingSportsPredictionPicks = false;
        this.toastService.addToast('sports predictions pick settlement started', 'sync', 'info');
      },
      error: () => {
        this.isSettlingSportsPredictionPicks = false;
        this.toastService.addToast('failed to settle sports predictions picks', 'error', 'danger');
      },
    });
  }
}
