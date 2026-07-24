import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { Photo, PhotoCollection, PhotoService } from '../../../services/photo-service/photo-service';
import { Loader } from '../../loader/loader';
import { ToastService } from '../../../services/toast-service/toast-service';
import { UserService } from '../../../services/user-service/user-service';
import { ImageDialog } from '../image-dialog/image-dialog';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { EmptyState } from '../../empty-state/empty-state';
import { Button } from '../../button/button';
import { AddCollectionDialog, AddCollectionDialogData } from '../add-collection-dialog/add-collection-dialog';

@Component({
  selector: 'jwpaisley-collection-details',
  standalone: true,
  imports: [CommonModule, Loader, RouterModule, MatIconModule, ImageDialog, ConfirmationDialog, EmptyState, Button, AddCollectionDialog],
  templateUrl: './collection-details.html',
  styleUrl: './collection-details.scss',
  host: { ngSkipHydration: '' },
})
export class CollectionDetails implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected collection: PhotoCollection | null = null;
  protected photos: Photo[] = [];
  protected selectedImageUrl: string | null = null;
  protected selectedImageIndex = 0;
  protected isImageDialogOpen = false;
  protected isAdmin = false;
  protected showDeleteConfirmation = false;
  protected showEditCollectionDialog = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,
    private toastService: ToastService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isAdmin = this.userService.isUserAdmin();
      this.cdr.detectChanges();
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const collectionId = params.get('id');

      if (!collectionId) {
        return;
      }

      this.isLoading = true;
      this.cdr.detectChanges();

      this.photoService.getPhotoCollection(collectionId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (collection) => {
          this.collection = collection;
          this.photoService.getPhotosByCollection(collectionId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (photos) => {
              this.photos = photos;
              this.isLoading = false;
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error(error);
              this.isLoading = false;
              this.cdr.detectChanges();
            },
          });
        },
        error: (error) => {
          this.toastService.addToast('failed to load collection details. please try again later.', 'error', 'danger');
          console.error(error);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    });
  }

  getPhotoPreviewUrl(photo: Photo): string {
    return this.photoService.getPreviewImageUrl(photo) || photo.image;
  }

  openImageDialog(photo: Photo): void {
    const index = this.photos.findIndex((item) => item.image === photo.image && item.caption === photo.caption);
    this.selectedImageIndex = index >= 0 ? index : 0;
    this.selectedImageUrl = this.photos[this.selectedImageIndex]?.image ?? null;
    this.isImageDialogOpen = true;
    this.cdr.detectChanges();
  }

  showPreviousImage(): void {
    if (this.selectedImageIndex <= 0) {
      return;
    }

    this.selectedImageIndex -= 1;
    this.selectedImageUrl = this.photos[this.selectedImageIndex]?.image ?? null;
    this.cdr.detectChanges();
  }

  showNextImage(): void {
    if (this.selectedImageIndex >= this.photos.length - 1) {
      return;
    }

    this.selectedImageIndex += 1;
    this.selectedImageUrl = this.photos[this.selectedImageIndex]?.image ?? null;
    this.cdr.detectChanges();
  }

  closeImageDialog(): void {
    this.isImageDialogOpen = false;
    this.selectedImageUrl = null;
    this.selectedImageIndex = 0;
    this.cdr.detectChanges();
  }

  onEditCollectionClick(): void {
    this.showEditCollectionDialog = true;
    this.cdr.detectChanges();
  }

  closeEditCollectionDialog(): void {
    this.showEditCollectionDialog = false;
    this.cdr.detectChanges();
  }

  handleEditCollectionConfirm(data: AddCollectionDialogData): void {
    if (!this.collection?.id) {
      return;
    }

    const existingImageUrls = new Set(this.photos.map((photo) => photo.image));
    const newImages = data.images.filter((image, index, images) => {
      const isAlreadyInCollection = existingImageUrls.has(image.url);
      const isDuplicateInSelection = images.findIndex((candidate) => candidate.url === image.url && candidate.name === image.name) !== index;

      return !isAlreadyInCollection && !isDuplicateInSelection;
    });

    this.isLoading = true;
    this.closeEditCollectionDialog();
    this.cdr.detectChanges();

    this.photoService.updatePhotoCollectionWithNewPhotos(this.collection.id, {
      title: data.title,
      description: data.description,
      location: data.location,
      images: newImages,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.addToast('collection updated', 'success');
        this.router.navigate(['/photography', 'collections', this.collection?.id]);
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.toastService.addToast('failed to update collection. please try again later.', 'error', 'danger');
        this.cdr.detectChanges();
      },
    });
  }

  onDeleteCollectionClick(): void {
    this.showDeleteConfirmation = true;
    this.cdr.detectChanges();
  }

  cancelDeleteCollection(): void {
    this.showDeleteConfirmation = false;
    this.cdr.detectChanges();
  }

  confirmDeleteCollection(): void {
    if (!this.collection?.id) {
      return;
    }

    this.isLoading = true;
    this.showDeleteConfirmation = false;
    this.cdr.detectChanges();

    this.photoService.deletePhotoCollection(this.collection.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.addToast('collection deleted', 'delete', 'success');
        this.router.navigate(['/photography', 'collections']);
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.toastService.addToast('failed to delete collection. please try again later.', 'error', 'danger');
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
