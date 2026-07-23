import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { Photo, PhotoCollection, PhotoService } from '../../../services/photo-service/photo-service';
import { Loader } from '../../loader/loader';
import { ToastService } from '../../../services/toast-service/toast-service';
import { ImageDialog } from '../image-dialog/image-dialog';

@Component({
  selector: 'jwpaisley-collection-details',
  standalone: true,
  imports: [CommonModule, Loader, RouterModule, MatIconModule, ImageDialog],
  templateUrl: './collection-details.html',
  styleUrl: './collection-details.scss',
})
export class CollectionDetails implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected collection: PhotoCollection | null = null;
  protected photos: Photo[] = [];
  protected selectedImageUrl: string | null = null;
  protected selectedImageIndex = 0;
  protected isImageDialogOpen = false;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
