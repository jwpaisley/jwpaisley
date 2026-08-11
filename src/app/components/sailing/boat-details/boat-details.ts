import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, catchError, concatMap, finalize, of, takeUntil } from 'rxjs';
import { Loader } from '../../loader/loader';
import { Sailboat, SailboatService } from '../../../services/sailboat-service/sailboat-service';
import { Action, ActionsService } from '../../../services/actions-service/actions-service';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { UserService } from '../../../services/user-service/user-service';
import { ToastService } from '../../../services/toast-service/toast-service';
import { ActionDockButton } from '../../action-dock-button/action-dock-button';
import { ActionDock } from '../../action-dock/action-dock';
import { PhotoCarousel } from '../../photo-carousel/photo-carousel';

@Component({
  selector: 'jwpaisley-boat-details',
  standalone: true,
  imports: [CommonModule, Loader, ActionDockButton, ActionDock, PhotoCarousel],
  templateUrl: './boat-details.html',
  styleUrl: './boat-details.scss',
})
export class BoatDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly sailboatService = inject(SailboatService);
  private readonly actionsService = inject(ActionsService);
  private readonly dialogService = inject(DialogService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();

  boat: Sailboat | null = null;
  boatId: string | null = null;
  carouselPhotoUrls: string[] = [];
  isLoading = true;
  isUserAdmin = false;

  ngOnInit(): void {
    this.isUserAdmin = this.userService.isUserAdmin();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.boatId = params.get('id');
      this.loadBoat();
      this.loadBoatPhotos();
    });

    this.actionsService.actionEmitted$.pipe(takeUntil(this.destroy$)).subscribe((action: Action) => {
      if (action.type === 'addSailboatPhoto') {
        void this.openAddPhotoDialog();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async openAddPhotoDialog(): Promise<void> {
    if (!this.isUserAdmin || !this.boatId) {
      return;
    }

    const result = await this.dialogService.openAddSailboatPhotoDialog<{ file: File; caption: string; showInCarousel: boolean }>({
      title: 'add sailboat photo',
      icon: 'photo_camera',
      confirmLabel: 'save photo',
      cancelLabel: 'cancel',
    });

    if (result.confirmed && result.value?.file) {
      const sailboatId = this.boatId;
      const dialogValue = result.value;

      if (!sailboatId || !dialogValue) {
        return;
      }

      this.sailboatService
        .uploadSailboatPhoto(dialogValue.file)
        .pipe(
          concatMap((uploadResult) =>
            this.sailboatService.createSailboatPhoto({
              sailboatId,
              voyageId: null,
              photoUrl: uploadResult.url,
              showInCarousel: dialogValue.showInCarousel ?? false,
              caption: dialogValue.caption ?? '',
            }),
          ),
        )
        .subscribe({
          next: () => {
            this.loadBoatPhotos();
            this.toastService.addToast('sailboat photo added', 'check', 'success');
          },
          error: (error) => {
            console.error('Error creating sailboat photo', error);
            this.toastService.addToast('failed to add sailboat photo', 'error', 'danger');
          },
        });
    }
  }

  private loadBoat(): void {
    if (!this.boatId) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.sailboatService.getSailboat(this.boatId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of(null)),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (boat) => {
          this.boat = boat ?? null;
        },
        error: () => {
          this.boat = null;
        },
      });
  }

  private loadBoatPhotos(): void {
    if (!this.boatId) {
      this.carouselPhotoUrls = [];
      return;
    }

    this.sailboatService.getSailboatPhotos(this.boatId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (photos) => {
        this.carouselPhotoUrls = (photos || [])
          .filter((photo) => photo.showInCarousel)
          .map((photo) => photo.photoUrl)
          .filter((photoUrl): photoUrl is string => Boolean(photoUrl));
      },
      error: () => {
        this.carouselPhotoUrls = [];
      },
    });
  }

  get ensignFlagUrl(): string {
    return this.boat?.privateEnsignFlagUrl?.trim() ?? '';
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
