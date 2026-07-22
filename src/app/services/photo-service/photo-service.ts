import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  createdAt?: string;
  updatedAt?: string;
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
    return this.httpClient.get<Photo[]>(`${this.apiUrl}/photos/collections/${collectionId}`);
  }

  getPhoto(photoId: string): Observable<Photo> {
    return this.httpClient.get<Photo>(`${this.apiUrl}/photos/${photoId}`);
  }

  deletePhoto(photoId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/photos/${photoId}`);
  }

  uploadPhoto(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.httpClient.post<{ url: string }>(`${this.apiUrl}/photos/upload`, formData);
  }

  createPhotoCollection(photoCollection: PhotoCollection): Observable<PhotoCollection> {
    return this.httpClient.post<PhotoCollection>(`${this.apiUrl}/photo-collections`, photoCollection);
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

  deletePhotoCollection(photoCollectionId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/photo-collections/${photoCollectionId}`);
  }
}
