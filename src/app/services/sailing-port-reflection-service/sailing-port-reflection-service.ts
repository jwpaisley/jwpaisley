import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { getApiUrl } from '../../helpers/api-url';
import {
  MarineConditionLevel,
  SailingConditionsCardData,
} from '../../components/sailing/sailing-conditions-card/sailing-conditions-card';

export interface SailingPort {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SailingPortReflectionService {
  private httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api/sailing-ports';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api/sailing-ports';
  private readonly apiUrl = getApiUrl(this.localApiUrl, this.prodApiUrl);

  reflect(ports: SailingPort[]): SailingConditionsCardData[] {
    return ports.map((port, index) => ({
      id: port.id || `port-${index}`,
      location: port.name,
      title: `${port.name} outlook`,
      condition: this.getCondition(port),
      windDirection: this.getWindDirection(index),
      windSpeed: this.getWindSpeed(index),
      currentSpeed: this.getCurrentSpeed(index),
      currentDirection: this.getCurrentDirection(index),
      gusts: this.getGusts(index),
      waveHeight: this.getWaveHeight(index),
      waterTemp: this.getWaterTemp(index),
      visibility: this.getVisibility(index),
      forecast: this.getForecast(index),
      time: 'updated just now',
    }));
  }

  getPorts(): Observable<SailingPort[]> {
    return this.httpClient.get<SailingPort[]>(this.apiUrl);
  }

  private getCondition(port: SailingPort): MarineConditionLevel {
    const score = this.getConditionScore(port);

    if (score >= 80) {
      return MarineConditionLevel.IDEAL;
    }

    if (score >= 60) {
      return MarineConditionLevel.GOOD;
    }

    if (score >= 40) {
      return MarineConditionLevel.LIGHT;
    }

    if (score >= 25) {
      return MarineConditionLevel.CAUTION;
    }

    if (score >= 10) {
      return MarineConditionLevel.HAZARDOUS;
    }

    return MarineConditionLevel.DANGEROUS;
  }

  private getConditionScore(port: SailingPort): number {
    const nameScore = port.name?.length ?? 0;
    return Math.min(100, nameScore * 4 + 35);
  }

  private getWindDirection(index: number): string {
    const directions = ['NW', 'W', 'SW', 'S', 'SE', 'E', 'NE', 'N'];
    return directions[index % directions.length];
  }

  private getWindSpeed(index: number): number {
    return 8 + (index % 5) * 4;
  }

  private getGusts(index: number): number {
    return this.getWindSpeed(index) + 4 + (index % 3);
  }

  private getCurrentSpeed(index: number): number | null {
    return 1 + (index % 4) * 0.5;
  }

  private getCurrentDirection(index: number): string {
    const directions = ['180° S', '225° SW', '270° W', '315° NW'];
    return directions[index % directions.length];
  }

  private getWaveHeight(index: number): string {
    const heights = ['1-2 ft', '2-3 ft', '3-4 ft', '4-5 ft', '5-6 ft'];
    return heights[index % heights.length];
  }

  private getWaterTemp(index: number): number {
    return 62 + (index % 6) * 2;
  }

  private getVisibility(index: number): string {
    return `${(8 + index).toFixed(1)} km`;
  }

  private getForecast(index: number): string {
    const forecasts = ['clear', 'sunny', 'mixed', 'windy', 'stormy'];
    return forecasts[index % forecasts.length];
  }

}
