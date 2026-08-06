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

@Injectable({
  providedIn: 'root',
})
export class SailboatService {
  private httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api/sailboats';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api/sailboats';
  private readonly apiUrl = getApiUrl(this.localApiUrl, this.prodApiUrl);

  getSailboats(): Observable<Sailboat[]> {
    return this.httpClient.get<Sailboat[]>(this.apiUrl);
  }

  getSailboat(id: string): Observable<Sailboat> {
    return this.httpClient.get<Sailboat>(`${this.apiUrl}/${id}`);
  }

  createSailboat(sailboat: Sailboat): Observable<Sailboat> {
    return this.httpClient.post<Sailboat>(this.apiUrl, sailboat);
  }

  updateSailboat(sailboat: Sailboat): Observable<Sailboat> {
    return this.httpClient.put<Sailboat>(`${this.apiUrl}/${sailboat.id}`, sailboat);
  }

  deleteSailboat(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
