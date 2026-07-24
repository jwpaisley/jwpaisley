import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { finalize, takeUntil } from 'rxjs';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Loader } from '../../loader/loader';
import { CommonModule } from '@angular/common';
import { Photo, PhotoService } from '../../../services/photo-service/photo-service';
import { EmptyState } from '../../empty-state/empty-state';
import { Action, ActionsService } from '../../../services/actions-service/actions-service';
import { AddCollectionDialog, AddCollectionDialogData } from '../add-collection-dialog/add-collection-dialog';
import { ImageDialog } from '../image-dialog/image-dialog';

@Component({
  selector: 'jwpaisley-photography-timeline',
  standalone: true,
  imports: [Loader, CommonModule, EmptyState, AddCollectionDialog, ImageDialog],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  host: { ngSkipHydration: '' },
})
export class Timeline implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected photos: Photo[] = [];
  protected groupedPhotos: { label: string; photos: Photo[] }[] = [];
  protected showAddCollectionDialog = false;
  protected selectedImageUrl: string | null = null;
  protected selectedImageIndex = 0;
  protected isImageDialogOpen = false;

  constructor(
    private actionsService: ActionsService,
    private photoService: PhotoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  private groupPhotosByMonth(photos: Photo[]): { label: string; photos: Photo[] }[] {
    const sortedPhotos = [...photos].sort((a, b) => {
      const dateA = a.takenDate ? Date.parse(a.takenDate) : 0;
      const dateB = b.takenDate ? Date.parse(b.takenDate) : 0;
      return dateB - dateA;
    });

    const groups = new Map<string, { label: string; photos: Photo[] }>();

    sortedPhotos.forEach((photo) => {
      const date = photo.takenDate ? new Date(photo.takenDate) : null;
      const monthKey = date && !Number.isNaN(date.getTime())
        ? `${date.getFullYear()}-${date.getMonth()}`
        : '__unknown__';

      const label = date && !Number.isNaN(date.getTime())
        ? `${date.toLocaleString('en', { month: 'long' }).toLowerCase()} ${date.getFullYear()}`
        : 'unknown';

      const existingGroup = groups.get(monthKey);
      if (existingGroup) {
        existingGroup.photos.push(photo);
      } else {
        groups.set(monthKey, { label, photos: [photo] });
      }
    });

    return Array.from(groups.values());
  }

  private getPhotos(): void {
    this.isLoading = true;

    this.photoService.getPhotos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.photos = response;
          this.groupedPhotos = this.groupPhotosByMonth(response);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.toastService.addToast('failed to load photos. please try again later.', 'error', 'danger');
          console.error(error);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  protected openAddCollectionDialog(): void {
    this.showAddCollectionDialog = true;
    this.cdr.detectChanges();
  }

  protected closeAddCollectionDialog(): void {
    this.showAddCollectionDialog = false;
    this.cdr.detectChanges();
  }

  protected handleAddCollectionConfirm(data: AddCollectionDialogData): void {
    this.isLoading = true;

    this.photoService.createPhotoCollectionWithPhotos({
      title: data.title,
      description: data.description,
      location: data.location,
      images: data.images,
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.addToast('photo collection created.', 'success');
          this.closeAddCollectionDialog();
          this.getPhotos();
        },
        error: (error) => {
          this.toastService.addToast('failed to create photo collection. please try again later.', 'error', 'danger');
          console.error(error);
        },
      });
  }

  protected getPhotoPreviewUrl(photo: Photo): string {
    return this.photoService.getPreviewImageUrl(photo) || photo.image;
  }

  protected openImageDialog(photo: Photo): void {
    const index = this.photos.findIndex((item) => item.image === photo.image && item.caption === photo.caption);
    this.selectedImageIndex = index >= 0 ? index : 0;
    this.selectedImageUrl = this.photos[this.selectedImageIndex]?.image ?? null;
    this.isImageDialogOpen = true;
    this.cdr.detectChanges();
  }

  protected showPreviousImage(): void {
    if (this.selectedImageIndex <= 0) {
      return;
    }

    this.selectedImageIndex -= 1;
    this.selectedImageUrl = this.photos[this.selectedImageIndex]?.image ?? null;
    this.cdr.detectChanges();
  }

  protected showNextImage(): void {
    if (this.selectedImageIndex >= this.photos.length - 1) {
      return;
    }

    this.selectedImageIndex += 1;
    this.selectedImageUrl = this.photos[this.selectedImageIndex]?.image ?? null;
    this.cdr.detectChanges();
  }

  protected closeImageDialog(): void {
    this.isImageDialogOpen = false;
    this.selectedImageUrl = null;
    this.selectedImageIndex = 0;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getPhotos();

     this.actionsService.actionEmitted$
        .pipe(takeUntil(this.destroy$))
        .subscribe((action: Action) => {
          if (action.type === 'add') {
            this.openAddCollectionDialog();
          }
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
