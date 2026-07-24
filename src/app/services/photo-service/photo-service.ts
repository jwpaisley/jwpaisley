import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, concatMap, forkJoin, throwError } from 'rxjs';

export declare interface Photo {
  id?: string;
  collection?: string;
  image: string;
  caption?: string;
  location?: string;
  takenDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export declare interface PhotoCollection {
  id?: string;
  title: string;
  caption?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PhotoUploadValue {
  name: string;
  url: string;
  file?: File;
}

export interface PhotoUploadResponse {
  url: string;
  thumbnailUrl?: string;
}

export interface CreatePhotoCollectionPayload {
  title: string;
  description: string;
  location: string;
  images: PhotoUploadValue[];
}

export declare interface PhotoCollectionPage {
  items: PhotoCollection[];
  nextPageToken: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api';
  private readonly apiUrl = this.prodApiUrl;

  createPhoto(photo: Photo): Observable<Photo> {
    return this.httpClient.post<Photo>(`${this.apiUrl}/photos`, photo);
  }

  getPhotos(): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>(`${this.apiUrl}/photos`);
  }

  getPhotosByCollection(collectionId: string): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>(`${this.apiUrl}/photo-collections/${collectionId}/photos`);
  }

  getPhoto(photoId: string): Observable<Photo> {
    return this.httpClient.get<Photo>(`${this.apiUrl}/photos/${photoId}`);
  }

  deletePhoto(photoId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/photos/${photoId}`);
  }

  uploadPhoto(file: File): Observable<PhotoUploadResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.httpClient.post<PhotoUploadResponse>(`${this.apiUrl}/photos/upload`, formData);
  }

  getPreviewImageUrl(photo: Photo): string {
    const imageUrl = photo?.image;
    if (!imageUrl) {
      return '';
    }

    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) {
      return '';
    }

    const [baseUrl, queryString] = trimmedUrl.split('?');
    const lastSlashIndex = baseUrl.lastIndexOf('/');
    if (lastSlashIndex < 0) {
      return trimmedUrl;
    }

    const fileName = baseUrl.slice(lastSlashIndex + 1);
    if (fileName.startsWith('thumb-')) {
      return trimmedUrl;
    }

    const thumbnailFileName = `thumb-${fileName}`;
    const thumbnailUrl = `${baseUrl.slice(0, lastSlashIndex + 1)}${thumbnailFileName}`;

    return queryString ? `${thumbnailUrl}?${queryString}` : thumbnailUrl;
  }

  createPhotoCollection(photoCollection: PhotoCollection): Observable<PhotoCollection> {
    return this.httpClient.post<PhotoCollection>(`${this.apiUrl}/photo-collections`, photoCollection);
  }

  updatePhotoCollection(photoCollection: PhotoCollection): Observable<PhotoCollection> {
    if (!photoCollection.id) {
      return throwError(() => new Error('Collection id is required to update a collection.'));
    }

    return this.httpClient.put<PhotoCollection>(`${this.apiUrl}/photo-collections/${photoCollection.id}`, photoCollection);
  }

  createPhotoCollectionWithPhotos(payload: CreatePhotoCollectionPayload): Observable<Photo[]> {
    return this.createPhotoCollection({
      title: payload.title,
      caption: payload.description,
      location: payload.location,
    }).pipe(
      concatMap((collection) => {
        const imageFiles = payload.images.filter((image) => image.file instanceof File);

        if (imageFiles.length !== payload.images.length) {
          return throwError(() => new Error('Each selected photo must include a file.'));
        }

        return forkJoin(
          imageFiles.map((image) =>
            this.uploadPhoto(image.file as File).pipe(
              concatMap((uploadResult) =>
                this.createPhoto({
                  collection: collection.id,
                  image: uploadResult.url,
                  caption: image.name,
                  location: payload.location,
                  takenDate: image.file?.lastModified
                    ? new Date(image.file.lastModified).toISOString().slice(0, 10)
                    : undefined,
                }),
              ),
            ),
          ),
        );
      }),
    );
  }

  getPhotoCollections(pageToken?: string): Observable<PhotoCollectionPage> {
    let params = new HttpParams();

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.httpClient.get<PhotoCollectionPage>(`${this.apiUrl}/photo-collections`, { params });
  }

  getPhotoCollection(photoCollectionId: string): Observable<PhotoCollection> {
    return this.httpClient.get<PhotoCollection>(`${this.apiUrl}/photo-collections/${photoCollectionId}`);
  }

  updatePhotoCollectionWithNewPhotos(collectionId: string, payload: CreatePhotoCollectionPayload): Observable<Photo[]> {
    return this.updatePhotoCollection({
      id: collectionId,
      title: payload.title,
      caption: payload.description,
      location: payload.location,
    }).pipe(
      concatMap(() => {
        const imageFiles = payload.images.filter((image) => image.file instanceof File);

        if (imageFiles.length === 0) {
          return new Observable<Photo[]>((observer) => {
            observer.next([]);
            observer.complete();
          });
        }

        return forkJoin(
          imageFiles.map((image) =>
            this.uploadPhoto(image.file as File).pipe(
              concatMap((uploadResult) =>
                this.createPhoto({
                  collection: collectionId,
                  image: uploadResult.url,
                  caption: image.name,
                  location: payload.location,
                  takenDate: image.file?.lastModified
                    ? new Date(image.file.lastModified).toISOString().slice(0, 10)
                    : undefined,
                }),
              ),
            ),
          ),
        );
      }),
    );
  }

  deletePhotoCollection(photoCollectionId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/photo-collections/${photoCollectionId}`);
  }
}
