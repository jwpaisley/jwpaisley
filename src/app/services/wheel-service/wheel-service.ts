import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../helpers/api-url';

export interface WheelOptionApi {
  id?: string;
  value: number;
  probability: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface WheelSpinResponse {
  spin?: {
    id?: string;
    userId?: string;
    outcome?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
  outcome?: number;
  coinsAwarded?: number;
  newCoinBalance?: number;
  wheelOption?: WheelOptionApi;
}

export interface CanSpinWheelResponse {
  canSpin: boolean;
  lastSpinAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class WheelService {
  private readonly httpClient = inject(HttpClient);
  private readonly localApiBaseUrl = 'http://localhost:8080/api';
  private readonly prodApiBaseUrl = 'https://api.jwpaisley.com/api';
  private readonly apiUrl = getApiUrl(this.localApiBaseUrl, this.prodApiBaseUrl);
  private readonly wheelOptionsApiUrl = `${this.apiUrl}/wheel-options`;
  private readonly wheelSpinsApiUrl = `${this.apiUrl}/wheel-spins`;

  getWheelOptions(): Observable<WheelOptionApi[]> {
    return this.httpClient.get<WheelOptionApi[]>(this.wheelOptionsApiUrl);
  }

  getWheelOption(id: string): Observable<WheelOptionApi> {
    return this.httpClient.get<WheelOptionApi>(`${this.wheelOptionsApiUrl}/${id}`);
  }

  createWheelOption(option: WheelOptionApi): Observable<WheelOptionApi> {
    return this.httpClient.post<WheelOptionApi>(this.wheelOptionsApiUrl, option);
  }

  updateWheelOption(option: WheelOptionApi): Observable<WheelOptionApi> {
    return this.httpClient.put<WheelOptionApi>(`${this.wheelOptionsApiUrl}/${option.id}`, option);
  }

  deleteWheelOption(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.wheelOptionsApiUrl}/${id}`);
  }

  getCanSpinWheel(): Observable<CanSpinWheelResponse> {
    return this.httpClient.get<CanSpinWheelResponse>(`${this.wheelSpinsApiUrl}/can-spin`);
  }

  spinWheel(): Observable<WheelSpinResponse> {
    return this.httpClient.post<WheelSpinResponse>(`${this.wheelSpinsApiUrl}/spin`, {});
  }
}
