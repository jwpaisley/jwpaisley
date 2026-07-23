import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { finalize, forkJoin, takeUntil } from 'rxjs';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Loader } from '../../loader/loader';
import { CommonModule } from '@angular/common';
import { Photo, PhotoCollection, PhotoService } from '../../../services/photo-service/photo-service';
import { EmptyState } from '../../empty-state/empty-state';
import { AddCollectionDialog, AddCollectionDialogData } from '../add-collection-dialog/add-collection-dialog';
import { Action, ActionsService } from '../../../services/actions-service/actions-service';
import { CollectionCard } from '../collection-card/collection-card';

@Component({
  selector: 'jwpaisley-photography-collections',
  imports: [Loader, CommonModule, EmptyState, AddCollectionDialog, CollectionCard],
  templateUrl: './collections.html',
  styleUrl: './collections.scss',
})
export class Collections implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected photoCollections: PhotoCollection[] = [];
  protected collectionPhotos: Record<string, Photo[]> = {};
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

  protected trackCollection(index: number, collection: PhotoCollection): string {
    return collection.id ?? `${index}`;
  }

  private getPhotoCollections(): void {
    this.isLoading = true;

    this.photoService.getPhotoCollections()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.photoCollections = response.items;
          this.collectionPhotos = {};

          if (this.photoCollections.length > 0) {
            const photoRequests = this.photoCollections.map((collection) =>
              this.photoService.getPhotosByCollection(collection.id ?? '').pipe(
                takeUntil(this.destroy$),
              ),
            );

            forkJoin(photoRequests).subscribe({
              next: (photosByCollection) => {
                this.photoCollections.forEach((collection, index) => {
                  this.collectionPhotos[collection.id ?? ''] = photosByCollection[index] ?? [];
                });
                this.isLoading = false;
                this.cdr.detectChanges();
              },
              error: (error) => {
                console.error(error);
                this.isLoading = false;
                this.cdr.detectChanges();
              },
            });
          } else {
            this.isLoading = false;
            this.cdr.detectChanges();
          }
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
