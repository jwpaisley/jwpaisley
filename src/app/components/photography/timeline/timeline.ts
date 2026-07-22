import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Loader } from '../../loader/loader';
import { CommonModule } from '@angular/common';
import { PhotoCollection, PhotoService } from '../../../services/photo-service/photo-service';

@Component({
  selector: 'jwpaisley-photography-timeline',
  imports: [Loader, CommonModule],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected photoCollections: PhotoCollection[] = [];

  constructor(
    private photoService: PhotoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

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

  ngOnInit(): void {
    this.getPhotoCollections();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
