import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { EmptyState } from '../../empty-state/empty-state';
import { Loader } from '../../loader/loader';
import { Action, ActionsService } from '../../../services/actions-service/actions-service';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { ToastService } from '../../../services/toast-service/toast-service';
import { UserService } from '../../../services/user-service/user-service';
import { ActionDock } from '../../action-dock/action-dock';
import { ActionDockButton } from '../../action-dock-button/action-dock-button';
import { LeagueCard } from '../league-card/league-card';
import {
  CreateSportsPredictionLeagueDialogData,
} from '../create-sports-prediction-league-dialog/create-sports-prediction-league-dialog';
import {
  SportsPredictionLeague,
  SportsPredictionService,
} from '../../../services/sports-prediction-service/sports-prediction-service';

@Component({
  selector: 'jwpaisley-sports-predictions-leagues',
  standalone: true,
  imports: [CommonModule, Loader, EmptyState, ActionDock, ActionDockButton, LeagueCard],
  templateUrl: './leagues.html',
  styleUrl: './leagues.scss',
})
export class Leagues implements OnInit, OnDestroy {
  private readonly sportsPredictionService = inject(SportsPredictionService);
  private readonly actionsService = inject(ActionsService);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);
  private readonly destroy$ = new Subject<void>();

  myLeagues: SportsPredictionLeague[] = [];
  openLeagues: SportsPredictionLeague[] = [];
  pastLeagues: SportsPredictionLeague[] = [];
  participantCounts: Record<string, number> = {};
  isLoading = true;
  isUserAdmin = false;

  ngOnInit(): void {
    this.isUserAdmin = this.userService.isUserAdmin();
    this.loadLeagues();

    this.actionsService.actionEmitted$.pipe(takeUntil(this.destroy$)).subscribe((action: Action) => {
      if (action.type === 'addSportsPredictionLeague') {
        void this.openCreateLeagueDialog();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLeagues(): void {
    this.isLoading = true;

    forkJoin({
      myLeagues: this.sportsPredictionService.getMyLeagues(),
      openLeagues: this.sportsPredictionService.getOpenLeagues(),
      pastLeagues: this.sportsPredictionService.getPastLeagues(),
      participants: this.sportsPredictionService.getLeagueParticipants(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ myLeagues, openLeagues, pastLeagues, participants }) => {
        this.myLeagues = myLeagues;
        this.openLeagues = openLeagues;
        this.pastLeagues = pastLeagues;
        this.participantCounts = {};

        const allLeagues = [...myLeagues, ...openLeagues, ...pastLeagues];
        for (const league of allLeagues) {
          if (league.id) {
            this.participantCounts[league.id] = 0;
          }
        }

        for (const participant of participants) {
          const leagueId = participant.leagueId;
          if (!leagueId) {
            continue;
          }

          this.participantCounts[leagueId] = (this.participantCounts[leagueId] ?? 0) + 1;
        }

        this.isLoading = false;
      },
      error: () => {
        this.myLeagues = [];
        this.openLeagues = [];
        this.pastLeagues = [];
        this.participantCounts = {};
        this.isLoading = false;
        this.toastService.addToast('failed to fetch league sections', 'error', 'danger');
      },
    });
  }

  getParticipantCount(leagueId?: string): number {
    return leagueId ? (this.participantCounts[leagueId] ?? 0) : 0;
  }

  private async openCreateLeagueDialog(): Promise<void> {
    if (!this.isUserAdmin) {
      return;
    }

    const result = await this.dialogService.openCreateSportsPredictionLeagueDialog<CreateSportsPredictionLeagueDialogData>({
      title: 'create league',
      icon: 'sports_soccer',
      confirmLabel: 'create league',
      cancelLabel: 'cancel',
    });

    if (result.confirmed && result.value) {
      this.isLoading = true;

      this.sportsPredictionService.createLeague({
        ...result.value,
        imageUrl: null,
        leagueImageUrl: null,
        leagueStartDate: null,
        leagueEndDate: null,
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.loadLeagues();
        },
        error: () => {
          this.isLoading = false;
          this.toastService.addToast('failed to create league', 'error', 'danger');
        },
      });
    }
  }
}
