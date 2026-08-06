import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Loader } from '../../loader/loader';
import { Sailboat, SailboatService } from '../../../services/sailboat-service/sailboat-service';

@Component({
  selector: 'jwpaisley-boat-details',
  standalone: true,
  imports: [CommonModule, Loader],
  templateUrl: './boat-details.html',
  styleUrl: './boat-details.scss',
})
export class BoatDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly sailboatService = inject(SailboatService);
  private readonly destroy$ = new Subject<void>();

  boat: Sailboat | null = null;
  boatId: string | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.boatId = params.get('id');
      this.loadBoat();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBoat(): void {
    if (!this.boatId) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.sailboatService.getSailboat(this.boatId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (boat) => {
        this.boat = boat;
        this.isLoading = false;
      },
      error: () => {
        this.boat = null;
        this.isLoading = false;
      },
    });
  }

  get makeModel(): string {
    const parts = [this.boat?.make, this.boat?.model].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'details pending';
  }

  get hullDescription(): string {
    const parts = [this.boat?.hullMaterial, this.boat?.hullType].filter(Boolean);
    return parts.length > 0 ? parts.join(' / ') : 'n/a';
  }

  get lengthDisplay(): string {
    return this.formatFeetAndInches(this.boat?.loa);
  }

  get beamDisplay(): string {
    return this.formatFeetAndInches(this.boat?.beamFt);
  }

  get displacementDisplay(): string {
    return this.formatWeight(this.boat?.displacementWeight);
  }

  get ballastDisplay(): string {
    return this.formatWeight(this.boat?.ballastWeight);
  }

  private formatFeetAndInches(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return 'n/a';
    }

    const totalInches = Math.round(value * 12);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;

    return inches === 0 ? `${feet}'` : `${feet}'${inches}"`;
  }

  private formatWeight(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return 'n/a';
    }

    return `${value.toLocaleString()} lbs`;
  }
}
