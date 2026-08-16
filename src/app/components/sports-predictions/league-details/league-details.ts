import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from '../../card/card';
import { CardGrid } from '../../card-grid/card-grid';
import { Loader } from '../../loader/loader';
import { EmptyState } from '../../empty-state/empty-state';
import { Button } from '../../button/button';
import { PeopleList, PeopleListPerson } from '../../people-list/people-list';
import { KeyValueList } from '../../key-value-list/key-value-list';
import { Standings, StandingsItem } from '../../standings/standings';
import { Scrollbox } from '../../scrollbox/scrollbox';
import { FixtureList } from '../fixture-list/fixture-list';
import { DisplayPick, PickList } from '../pick-list/pick-list';
import { FixturePickOption, FixturePickRequest } from '../fixture/fixture';
import { UserService } from '../../../services/user-service/user-service';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { ToastService } from '../../../services/toast-service/toast-service';
import { SportsPredictionFixture, SportsPredictionLeague, SportsPredictionPicksPage, SportsPredictionPick, SportsPredictionService } from '../../../services/sports-prediction-service/sports-prediction-service';

interface ParticipantRow {
  id: string;
  userId: string;
  name: string;
  points: number;
  imageUrl?: string | null;
  rank: number;
}

@Component({
  selector: 'jwpaisley-sports-prediction-league-details',
  standalone: true,
  imports: [CommonModule, Loader, RouterModule, CardGrid, Card, EmptyState, Button, PeopleList, KeyValueList, Standings, Scrollbox, FixtureList, PickList],
  templateUrl: './league-details.html',
  styleUrl: './league-details.scss',
})
export class LeagueDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly sportsPredictionService = inject(SportsPredictionService);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();

  league: SportsPredictionLeague | null = null;
  leagueId: string | null = null;
  currentUserId: string | null = null;
  participants: ParticipantRow[] = [];
  isLoading = true;
  upcomingFixtures: SportsPredictionFixture[] = [];
  fixtureTeamNameById: Record<string, string> = {};
  fixtureTeamLogoById: Record<string, string> = {};
  selectedPickOptionByFixtureId: Record<string, FixturePickOption> = {};
  recentPicks: SportsPredictionPick[] = [];
  private isSubmittingPick = false;

  get displayRecentPicks(): DisplayPick[] {
    const participantNameByUserId = this.participants.reduce<Record<string, string>>((acc, participant) => {
      acc[participant.userId] = participant.name;
      return acc;
    }, {});

    const participantImageByUserId = this.participants.reduce<Record<string, string>>((acc, participant) => {
      if (participant.imageUrl) {
        acc[participant.userId] = participant.imageUrl;
      }
      return acc;
    }, {});

    const fixtureById = this.upcomingFixtures.reduce<Record<string, SportsPredictionFixture>>((acc, fixture) => {
      if (fixture.id) {
        acc[this.normalizeFixtureId(fixture.id)] = fixture;
      }
      return acc;
    }, {});

    return this.recentPicks.map((pick) => {
      const fixture = fixtureById[this.normalizeFixtureId(pick.fixtureId)];
      const homeTeamName = fixture ? (this.fixtureTeamNameById[fixture.homeTeamId] ?? 'home') : 'home';
      const awayTeamName = fixture ? (this.fixtureTeamNameById[fixture.awayTeamId] ?? 'away') : 'away';
      const fixtureLabel = fixture ? `${homeTeamName} vs ${awayTeamName}` : 'fixture';

      const pickLabel = pick.isDrawPick
        ? 'draw'
        : (pick.selectedTeamId ? (this.fixtureTeamNameById[pick.selectedTeamId] ?? 'team') : 'team');

      return {
        id: pick.id ?? `${pick.userId}-${pick.fixtureId}`,
        pickerName: participantNameByUserId[pick.userId] ?? 'unknown user',
        pickerImageUrl: participantImageByUserId[pick.userId] ?? null,
        fixtureLabel,
        pickLabel,
        payoutPoints: Math.ceil(10 * (pick.payoutMultiplier ?? 0)),
        status: pick.status ?? 'pending',
        createdAt: pick.createdAt,
      };
    });
  }

  get peopleListData(): PeopleListPerson[] {
    return this.participants.map((participant) => ({
      id: participant.userId,
      firstName: participant.name.split(' ')[0] ?? '',
      lastName: participant.name.split(' ').slice(1).join(' ') ?? '',
      profilePictureUrl: participant.imageUrl ?? null,
    }));
  }

  get showJoinLeagueButton(): boolean {
    return !!this.currentUserId && !!this.leagueId && !this.participants.some((participant) => participant.userId === this.currentUserId);
  }

  get showLeaveLeagueButton(): boolean {
    return !!this.currentUserId && !!this.leagueId && this.participants.some((participant) => participant.userId === this.currentUserId);
  }

  get currentUserParticipantId(): string | null {
    return this.participants.find((participant) => participant.userId === this.currentUserId)?.id ?? null;
  }

  get leagueKeyValuePairs() {
    if (!this.league) {
      return [];
    }

    return [
      { key: '🥇 first place', value: `🪙 ${this.league.firstPlacePrizeCoins ?? 0}` },
      { key: '🥈 second place', value: `🪙 ${this.league.secondPlacePrizeCoins ?? 0}` },
      { key: '🥉 third place', value: `🪙 ${this.league.thirdPlacePrizeCoins ?? 0}` },
      { key: 'start date', value: this.formatDate(this.league.leagueStartDate) },
      { key: 'end date', value: this.formatDate(this.league.leagueEndDate) },
      { key: 'created on', value: this.formatDate(this.league.createdAt) },
      { key: 'updated on', value: this.formatDate(this.league.updatedAt) },
    ];
  }

  get standingsData(): StandingsItem[] {
    if (!this.leagueId) {
      return [];
    }

    const totalsByUser = new Map<string, number>();

    const totals = this.participants.map((participant) => ({
      label: participant.name,
      imageUrl: participant.imageUrl ?? null,
      points: totalsByUser.get(participant.userId) ?? 0,
    }));

    return totals.sort((a, b) => b.points - a.points);
  }

  ngOnInit(): void {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      const previousUserId = this.currentUserId;
      this.currentUserId = user?.id ?? null;

      if (this.league?.id && previousUserId !== this.currentUserId) {
        this.loadUpcomingFixtures();
      }
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.leagueId = params.get('id');
      this.loadLeague();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getLeagueInitials(name: string | null | undefined): string {
    if (!name) {
      return '-';
    }

    const words = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 3);

    if (words.length === 0) {
      return '-';
    }

    return words.map((word) => word.charAt(0).toUpperCase()).join('');
  }

  getParticipantInitials(name: string | null | undefined): string {
    if (!name) {
      return '-';
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (words.length === 0) {
      return '-';
    }

    return words.map((word) => word.charAt(0).toUpperCase()).join('');
  }

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

  async onJoinLeagueClick(): Promise<void> {
    if (!this.leagueId || !this.currentUserId) {
      return;
    }

    const result = await this.dialogService.openConfirmDialog({
      title: 'join league',
      text: `are you sure you want to join ${this.league?.name ?? 'this league'}?`,
      confirmLabel: 'join',
      cancelLabel: 'cancel',
    });

    if (!result.confirmed) {
      return;
    }

    this.isLoading = true;

    this.sportsPredictionService
      .createLeagueParticipant({
        leagueId: this.leagueId,
        userId: this.currentUserId,
        points: 0,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.addToast('joined league successfully', 'check', 'success');
          this.loadParticipants();
        },
        error: () => {
          this.isLoading = false;
          this.toastService.addToast('failed to join league', 'error', 'danger');
        },
      });
  }

  async onLeaveLeagueClick(): Promise<void> {
    if (!this.leagueId || !this.currentUserId || !this.currentUserParticipantId) {
      return;
    }

    const result = await this.dialogService.openConfirmDialog({
      title: 'leave league',
      text: `are you sure you want to leave ${this.league?.name ?? 'this league'}?`,
      confirmLabel: 'leave',
      cancelLabel: 'cancel',
    });

    if (!result.confirmed) {
      return;
    }

    this.isLoading = true;

    this.sportsPredictionService
      .deleteLeagueParticipant(this.currentUserParticipantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.addToast('left league successfully', 'remove', 'success');
          this.loadParticipants();
        },
        error: () => {
          this.isLoading = false;
          this.toastService.addToast('failed to leave league', 'error', 'danger');
        },
      });
  }

  async onPickRequested(pickRequest: FixturePickRequest): Promise<void> {
    if (this.isSubmittingPick) {
      return;
    }

    if (!this.leagueId || !this.currentUserId) {
      this.toastService.addToast('you need to be signed in to create picks', 'error', 'warning');
      return;
    }

    const payoutPoints = Math.ceil(10 * pickRequest.payoutMultiplier);

    const result = await this.dialogService.openConfirmDialog({
      title: 'confirm pick',
      text: `pick '${pickRequest.pickOption}' for ${pickRequest.homeTeamLabel} vs ${pickRequest.awayTeamLabel}? if you are correct, you'll earn ${payoutPoints} points`,
      confirmLabel: 'confirm',
      cancelLabel: 'cancel',
    });

    if (!result.confirmed) {
      return;
    }

    this.isSubmittingPick = true;

    this.sportsPredictionService
      .createPick({
        leagueId: this.leagueId,
        userId: this.currentUserId,
        fixtureId: pickRequest.fixtureId,
        selectedTeamId: pickRequest.selectedTeamId,
        isDrawPick: pickRequest.isDrawPick,
        isCorrect: false,
        isSettled: false,
        payoutMultiplier: pickRequest.payoutMultiplier,
        status: 'pending',
        coinsAwarded: 0,
        pointsAwarded: 0,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmittingPick = false;
          this.toastService.addToast('pick created', 'check', 'success');
          const fixtureIdKey = this.normalizeFixtureId(pickRequest.fixtureId);
          this.selectedPickOptionByFixtureId = {
            ...this.selectedPickOptionByFixtureId,
            [fixtureIdKey]: pickRequest.pickOption,
          };
        },
        error: () => {
          this.isSubmittingPick = false;
          this.toastService.addToast('failed to create pick', 'error', 'danger');
        },
      });
  }

  private loadLeague(): void {
    if (!this.leagueId) {
      this.league = null;
      this.participants = [];
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.sportsPredictionService
      .getLeague(this.leagueId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of(null)),
      )
      .subscribe({
        next: (league) => {
          this.league = league ?? null;
          this.loadUpcomingFixtures();
          this.loadParticipants();
        },
        error: () => {
          this.league = null;
          this.upcomingFixtures = [];
          this.fixtureTeamNameById = {};
          this.participants = [];
          this.isLoading = false;
        },
      });
  }

  private loadUpcomingFixtures(): void {
    if (!this.league?.id) {
      this.upcomingFixtures = [];
      this.fixtureTeamNameById = {};
      this.fixtureTeamLogoById = {};
      this.selectedPickOptionByFixtureId = {};
      this.recentPicks = [];
      return;
    }

    const leagueId = this.league.id;

    forkJoin({
      fixtures: this.sportsPredictionService.getFixturesForLeague(leagueId, 'UPCOMING', 0).pipe(catchError(() => of([]))),
      teams: this.sportsPredictionService.getTeamsForLeague(leagueId).pipe(catchError(() => of([]))),
      picks: this.currentUserId
        ? this.sportsPredictionService.getMyPicksForLeague(leagueId).pipe(catchError(() => of([])))
        : of([]),
      recentPicksPage: this.sportsPredictionService
        .getRecentPicksForLeague(leagueId, 0)
        .pipe(catchError(() => of({ page: 0, pageSize: 20, hasMore: false, picks: [] } as SportsPredictionPicksPage))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ fixtures, teams, picks, recentPicksPage }) => {
        this.fixtureTeamNameById = teams.reduce<Record<string, string>>((acc, team) => {
          if (team.id) {
            acc[team.id] = team.name;
          }
          return acc;
        }, {});

        this.fixtureTeamLogoById = teams.reduce<Record<string, string>>((acc, team) => {
          if (team.id && team.logoUrl) {
            acc[team.id] = team.logoUrl;
          }
          return acc;
        }, {});

        this.upcomingFixtures = fixtures;
        this.selectedPickOptionByFixtureId = this.buildSelectedPickOptionByFixtureId(fixtures, picks);
        this.recentPicks = recentPicksPage.picks ?? [];
      });
  }

  private buildSelectedPickOptionByFixtureId(
    fixtures: SportsPredictionFixture[],
    picks: SportsPredictionPick[],
  ): Record<string, FixturePickOption> {
    const fixtureById = fixtures.reduce<Record<string, SportsPredictionFixture>>((acc, fixture) => {
      if (fixture.id) {
        acc[this.normalizeFixtureId(fixture.id)] = fixture;
      }

      return acc;
    }, {});

    return picks.reduce<Record<string, FixturePickOption>>((acc, pick) => {
      const normalizedFixtureId = this.normalizeFixtureId(pick.fixtureId);
      const fixture = fixtureById[normalizedFixtureId];
      if (!fixture) {
        return acc;
      }

      if (pick.isDrawPick) {
        acc[normalizedFixtureId] = 'draw';
        return acc;
      }

      if (pick.selectedTeamId && pick.selectedTeamId === fixture.homeTeamId) {
        acc[normalizedFixtureId] = 'home';
        return acc;
      }

      if (pick.selectedTeamId && pick.selectedTeamId === fixture.awayTeamId) {
        acc[normalizedFixtureId] = 'away';
        return acc;
      }

      return acc;
    }, {});
  }

  private normalizeFixtureId(fixtureId: string): string {
    return fixtureId.trim().toLowerCase();
  }

  private loadParticipants(): void {
    if (!this.leagueId) {
      this.participants = [];
      this.isLoading = false;
      return;
    }

    this.sportsPredictionService
      .getParticipantsForLeague(this.leagueId)
      .pipe(
        takeUntil(this.destroy$),
        map((participants) =>
          participants
            .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
            .map((participant, index) => ({
              id: participant.id ?? participant.userId,
              userId: participant.userId,
              name: [participant.firstName, participant.lastName].filter(Boolean).join(' ') || 'unknown user',
              points: participant.points ?? 0,
              imageUrl: participant.profilePictureUrl ?? participant.profilePictureId ?? null,
              rank: index + 1,
            } satisfies ParticipantRow)),
        ),
        catchError(() => of([])),
      )
      .subscribe({
        next: (participants) => {
          this.participants = participants;
          this.loadLeagueTotals();
        },
        error: () => {
          this.participants = [];
          this.isLoading = false;
        },
      });
  }

  private loadLeagueTotals(): void {
    if (!this.leagueId) {
      this.isLoading = false;
      return;
    }

    this.sportsPredictionService
      .getLeagueUserTotals(this.leagueId)
      .pipe(takeUntil(this.destroy$), catchError(() => of([])))
      .subscribe({
        next: (totals) => {
          const totalsByUser = new Map<string, number>();
          totals.forEach((total) => {
            totalsByUser.set(total.userId, total.totalPoints ?? 0);
          });

          this.participants = this.participants.map((participant) => ({
            ...participant,
            points: totalsByUser.get(participant.userId) ?? participant.points ?? 0,
          }));

          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
