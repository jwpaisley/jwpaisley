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
import { UserService } from '../../../services/user-service/user-service';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { ToastService } from '../../../services/toast-service/toast-service';
import { SportsPredictionLeague, SportsPredictionService } from '../../../services/sports-prediction-service/sports-prediction-service';

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
  imports: [CommonModule, Loader, RouterModule, CardGrid, Card, EmptyState, Button, PeopleList],
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

  get peopleListData(): PeopleListPerson[] {
    return this.participants.map((participant) => ({
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

  ngOnInit(): void {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUserId = user?.id ?? null;
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
          this.loadParticipants();
        },
        error: () => {
          this.league = null;
          this.participants = [];
          this.isLoading = false;
        },
      });
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
          this.isLoading = false;
        },
        error: () => {
          this.participants = [];
          this.isLoading = false;
        },
      });
  }
}
