import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../helpers/api-url';

export interface Sailboat {
  id?: string;
  name: string;
  mmsi?: string | null;
  hinCin?: string | null;
  officialNumber?: string | null;
  flagState?: string | null;
  callSign?: string | null;
  make?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  yearBuilt?: number | null;
  designer?: string | null;
  hullType?: string | null;
  hullMaterial?: string | null;
  keelType?: string | null;
  rigType?: string | null;
  loa?: number | null;
  lwl?: number | null;
  beamFt?: number | null;
  draftMin?: number | null;
  draftMax?: number | null;
  displacementWeight?: number | null;
  ballastWeight?: number | null;
  sailArea?: number | null;
  phrfRating?: string | null;
  orcRating?: string | null;
  engineMakeModel?: string | null;
  engineHp?: number | null;
  fuelCapacityGal?: number | null;
  freshwaterCapacityGal?: number | null;
  holdingTankCapacityGal?: number | null;
  homePort?: string | null;
  privateEnsignFlagUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SailboatPhoto {
  id?: string;
  sailboatId: string;
  voyageId?: string | null;
  photoUrl?: string;
  showInCarousel?: boolean;
  caption?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SailboatService {
  private httpClient = inject(HttpClient);
  private readonly localApiBaseUrl = 'http://localhost:8080/api';
  private readonly prodApiBaseUrl = 'https://api.jwpaisley.com/api';
  private readonly apiUrl = getApiUrl(this.localApiBaseUrl, this.prodApiBaseUrl);
  private readonly sailboatApiUrl = `${this.apiUrl}/sailboats`;
  private readonly sailboatPhotoApiUrl = `${this.apiUrl}/sailboat-photos`;

  getSailboats(): Observable<Sailboat[]> {
    return this.httpClient.get<Sailboat[]>(this.sailboatApiUrl);
  }

  getSailboat(id: string): Observable<Sailboat> {
    return this.httpClient.get<Sailboat>(`${this.sailboatApiUrl}/${id}`);
  }

  getSailboatPhotos(sailboatId: string): Observable<SailboatPhoto[]> {
    return this.httpClient.get<SailboatPhoto[]>(`${this.sailboatApiUrl}/${sailboatId}/photos`);
  }

  createSailboat(sailboat: Sailboat): Observable<Sailboat> {
    return this.httpClient.post<Sailboat>(this.sailboatApiUrl, sailboat);
  }

  updateSailboat(sailboat: Sailboat): Observable<Sailboat> {
    return this.httpClient.put<Sailboat>(`${this.sailboatApiUrl}/${sailboat.id}`, sailboat);
  }

  deleteSailboat(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.sailboatApiUrl}/${id}`);
  }

  uploadSailboatPhoto(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.httpClient.post<{ url: string }>(`${this.sailboatPhotoApiUrl}/upload`, formData);
  }

  createSailboatPhoto(photo: SailboatPhoto): Observable<SailboatPhoto> {
    return this.httpClient.post<SailboatPhoto>(this.sailboatPhotoApiUrl, photo);
  }
}
