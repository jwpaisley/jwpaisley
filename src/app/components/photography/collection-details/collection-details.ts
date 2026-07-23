import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { Photo, PhotoCollection, PhotoService } from '../../../services/photo-service/photo-service';
import { Loader } from '../../loader/loader';
import { ToastService } from '../../../services/toast-service/toast-service';

@Component({
  selector: 'jwpaisley-collection-details',
  standalone: true,
  imports: [CommonModule, Loader, RouterModule, MatIconModule],
  templateUrl: './collection-details.html',
  styleUrl: './collection-details.scss',
})
export class CollectionDetails implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected collection: PhotoCollection | null = null;
  protected photos: Photo[] = [];

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
