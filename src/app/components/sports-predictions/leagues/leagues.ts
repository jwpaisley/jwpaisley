import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, forkJoin, of, takeUntil } from 'rxjs';
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
  currentLeaders: Record<string, string> = {};
  isLoading = true;
  isUserAdmin = false;
  isUserLoggedIn = false;

  ngOnInit(): void {
    this.isUserAdmin = this.userService.isUserAdmin();
    this.isUserLoggedIn = this.userService.isUserLoggedIn();
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

    const myLeaguesRequest = this.isUserLoggedIn
      ? this.sportsPredictionService.getMyLeagues()
      : of<SportsPredictionLeague[]>([]);

    forkJoin({
      myLeagues: myLeaguesRequest,
      openLeagues: this.sportsPredictionService.getOpenLeagues(),
      pastLeagues: this.sportsPredictionService.getPastLeagues(),
      participants: this.sportsPredictionService.getLeagueParticipants(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ myLeagues, openLeagues, pastLeagues, participants }) => {
        this.myLeagues = myLeagues;
        this.openLeagues = openLeagues;
        this.pastLeagues = pastLeagues;
        this.participantCounts = {};
        this.currentLeaders = {};

        const topParticipantByLeagueId: Record<string, { points: number; name: string }> = {};

        const allLeagues = [...myLeagues, ...openLeagues, ...pastLeagues];
        for (const league of allLeagues) {
          if (league.id) {
            this.participantCounts[league.id] = 0;
            this.currentLeaders[league.id] = '-';
          }
        }

        for (const participant of participants) {
          const leagueId = participant.leagueId;
          if (!leagueId) {
            continue;
          }

          this.participantCounts[leagueId] = (this.participantCounts[leagueId] ?? 0) + 1;

          const participantName = [participant.firstName, participant.lastName]
            .filter(Boolean)
            .join(' ')
            .trim();
          const name = participantName || 'unknown user';
          const points = participant.points ?? 0;
          const currentTop = topParticipantByLeagueId[leagueId];

          if (!currentTop || points > currentTop.points || (points === currentTop.points && name.localeCompare(currentTop.name) < 0)) {
            topParticipantByLeagueId[leagueId] = { points, name };
          }
        }

        Object.entries(topParticipantByLeagueId).forEach(([leagueId, topParticipant]) => {
          this.currentLeaders[leagueId] = topParticipant.name;
        });

        for (const league of allLeagues) {
          if (league.id && this.participantCounts[league.id] === 0) {
            this.currentLeaders[league.id] = '-';
          }
        }

        this.isLoading = false;
      },
      error: () => {
        this.myLeagues = [];
        this.openLeagues = [];
        this.pastLeagues = [];
        this.participantCounts = {};
        this.currentLeaders = {};
        this.isLoading = false;
        this.toastService.addToast('failed to fetch league sections', 'error', 'danger');
      },
    });
  }

  getParticipantCount(leagueId?: string): number {
    return leagueId ? (this.participantCounts[leagueId] ?? 0) : 0;
  }

  getCurrentLeader(leagueId?: string): string {
    return leagueId ? (this.currentLeaders[leagueId] ?? '-') : '-';
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
