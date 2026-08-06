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
  tideStationId?: string | null;
  currentStationId?: string | null;
  buoyStationId?: string | null;
  nwsOffice?: string | null;
  nwsGridX?: number | null;
  nwsGridY?: number | null;
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
      gusts: this.getGusts(index),
      waveHeight: this.getWaveHeight(index),
      waterTemp: this.getWaterTemp(index),
      tide: this.getTide(port),
      forecast: this.getForecast(index),
      time: 'updated just now',
      notes: this.getNotes(port),
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
    const gridScore = (port.nwsGridX ?? 0) + (port.nwsGridY ?? 0);
    return Math.min(100, nameScore * 2 + gridScore * 2 + 35);
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

  private getWaveHeight(index: number): string {
    const heights = ['1-2 ft', '2-3 ft', '3-4 ft', '4-5 ft', '5-6 ft'];
    return heights[index % heights.length];
  }

  private getWaterTemp(index: number): number {
    return 62 + (index % 6) * 2;
  }

  private getTide(port: SailingPort): string {
    const directions = ['rising', 'falling', 'slack'];
    const direction = directions[(port.name?.length ?? 0) % directions.length];
    const height = 1 + ((port.nwsGridX ?? 0) % 4) * 0.8;
    return `${direction} ${height.toFixed(1)} ft`;
  }

  private getForecast(index: number): string {
    const forecasts = ['clear', 'sunny', 'mixed', 'windy', 'stormy'];
    return forecasts[index % forecasts.length];
  }

  private getNotes(port: SailingPort): string {
    return `${port.name} is ready for a quick look at current conditions and local station data.`;
  }
}
