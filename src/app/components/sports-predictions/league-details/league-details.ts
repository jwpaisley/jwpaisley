import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { Loader } from '../../loader/loader';
import { UserService } from '../../../services/user-service/user-service';
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
  imports: [CommonModule, Loader, RouterModule],
  templateUrl: './league-details.html',
  styleUrl: './league-details.scss',
})
export class LeagueDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly sportsPredictionService = inject(SportsPredictionService);
  private readonly userService = inject(UserService);
  private readonly destroy$ = new Subject<void>();

  league: SportsPredictionLeague | null = null;
  leagueId: string | null = null;
  participants: ParticipantRow[] = [];
  isLoading = true;

  ngOnInit(): void {
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

    const normalizedName = name
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim();

    const words = normalizedName
      .split(/\s+/)
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
      .getLeagueParticipants()
      .pipe(
        takeUntil(this.destroy$),
        map((participants) =>
          participants
            .filter((participant) => participant.leagueId === this.leagueId)
            .sort((a, b) => (b.points ?? 0) - (a.points ?? 0)),
        ),
        catchError(() => of([])),
      )
      .subscribe({
        next: (participants) => {
          if (!participants.length) {
            this.participants = [];
            this.isLoading = false;
            return;
          }

          forkJoin(
            participants.map((participant) =>
              this.userService.getUserBasicInfo(participant.userId).pipe(
                map((user) => ({
                  id: participant.id ?? participant.userId,
                  userId: participant.userId,
                  name: `${user.firstName} ${user.lastName}`.trim() || 'unknown user',
                  points: participant.points ?? 0,
                  imageUrl: user.profilePictureUrl ?? null,
                  rank: 0,
                } satisfies ParticipantRow)),
              ),
            ),
          )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (resolvedParticipants) => {
                this.participants = resolvedParticipants
                  .sort((a, b) => b.points - a.points)
                  .map((participant, index) => ({
                    ...participant,
                    rank: index + 1,
                  }));
                this.isLoading = false;
              },
              error: () => {
                this.participants = [];
                this.isLoading = false;
              },
            });
        },
        error: () => {
          this.participants = [];
          this.isLoading = false;
        },
      });
  }
}
