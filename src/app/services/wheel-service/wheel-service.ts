import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, take } from 'rxjs/operators';
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

function withSingleNotFoundRetry<T>(request$: Observable<T>): Observable<T> {
  return request$.pipe(
    retryWhen((errors) =>
      errors.pipe(
        mergeMap((error) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            return timer(250);
          }

          return throwError(() => error);
        }),
        take(1),
      ),
    ),
  );
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
    return withSingleNotFoundRetry(this.httpClient.get<WheelOptionApi[]>(this.wheelOptionsApiUrl));
  }

  getWheelOption(id: string): Observable<WheelOptionApi> {
    return withSingleNotFoundRetry(
      this.httpClient.get<WheelOptionApi>(`${this.wheelOptionsApiUrl}/${id}`),
    );
  }

  createWheelOption(option: WheelOptionApi): Observable<WheelOptionApi> {
    return withSingleNotFoundRetry(this.httpClient.post<WheelOptionApi>(this.wheelOptionsApiUrl, option));
  }

  updateWheelOption(option: WheelOptionApi): Observable<WheelOptionApi> {
    return withSingleNotFoundRetry(
      this.httpClient.put<WheelOptionApi>(`${this.wheelOptionsApiUrl}/${option.id}`, option),
    );
  }

  deleteWheelOption(id: string): Observable<void> {
    return withSingleNotFoundRetry(this.httpClient.delete<void>(`${this.wheelOptionsApiUrl}/${id}`));
  }

  getCanSpinWheel(): Observable<CanSpinWheelResponse> {
    return withSingleNotFoundRetry(
      this.httpClient.get<CanSpinWheelResponse>(`${this.wheelSpinsApiUrl}/can-spin`),
    );
  }

  spinWheel(): Observable<WheelSpinResponse> {
    return withSingleNotFoundRetry(
      this.httpClient.post<WheelSpinResponse>(`${this.wheelSpinsApiUrl}/spin`, {}),
    );
  }
}
