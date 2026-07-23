import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { finalize, takeUntil } from 'rxjs';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Loader } from '../../loader/loader';
import { CommonModule } from '@angular/common';
import { PhotoCollection, PhotoService } from '../../../services/photo-service/photo-service';
import { EmptyState } from '../../empty-state/empty-state';
import { Action, ActionsService } from '../../../services/actions-service/actions-service';
import { AddCollectionDialog, AddCollectionDialogData } from '../add-collection-dialog/add-collection-dialog';

@Component({
  selector: 'jwpaisley-photography-timeline',
  imports: [Loader, CommonModule, EmptyState, AddCollectionDialog],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected photoCollections: PhotoCollection[] = [];
  protected showAddCollectionDialog = false;

  constructor(
    private actionsService: ActionsService,
    private photoService: PhotoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  protected get collections(): PhotoCollection[] {
    return this.photoCollections;
  }

  private getPhotoCollections(): void {
    this.isLoading = true;

    this.photoService.getPhotoCollections()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.photoCollections = response.items;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.toastService.addToast('failed to load photo collections. please try again later.', 'error', 'danger');
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
          this.getPhotoCollections();
        },
        error: (error) => {
          this.toastService.addToast('failed to create photo collection. please try again later.', 'error', 'danger');
          console.error(error);
        },
      });
  }

  ngOnInit(): void {
    this.getPhotoCollections();

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
