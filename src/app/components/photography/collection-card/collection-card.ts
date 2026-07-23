import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Photo, PhotoCollection } from '../../../services/photo-service/photo-service';

@Component({
  selector: 'jwpaisley-collection-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './collection-card.html',
  styleUrl: './collection-card.scss',
})
export class CollectionCard {
  @Input() collection!: PhotoCollection;
  @Input() photos: Photo[] = [];

  get previewImages(): Photo[] {
    const safePhotos = Array.isArray(this.photos) ? this.photos : [];
    return safePhotos.slice(0, 4);
  }

  get hasImages(): boolean {
    return this.previewImages.length > 0;
  }

  get isReady(): boolean {
    return !!this.collection;
  }

  get formattedDate(): string {
    if (!this.collection?.createdAt) {
      return '';
    }

    return new Date(this.collection.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getDetailsText(): string {
    const parts = [this.collection?.location, this.formattedDate].filter((value) => !!value);
    return parts.join(' • ');
  }
}
