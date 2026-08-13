import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { getApiUrl } from '../../helpers/api-url';
import {
  MarineConditionLevel,
  SailingConditionsCardData,
} from '../../components/sailing/sailing-conditions-card/sailing-conditions-card';

export interface SailingPortConditions {
  windSpeed?: number | null;
  windDirection?: string | null;
  gustSpeed?: number | null;
  waveSize?: number | null;
  currentSpeed?: number | null;
  waterTemperature?: number | null;
  currentTide?: string | null;
  tideSizeFeet?: number | null;
  airTemperature?: number | null;
  weather?: string | null;
  marineAlert?: string | null;
  fetchedAt?: string | null;
}

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
  conditions?: SailingPortConditions | null;
}

export interface CreateSailingPortRequest {
  name: string;
  latitude: number | null;
  longitude: number | null;
  tideStationId?: string | null;
  currentStationId?: string | null;
  buoyStationId?: string | null;
  nwsOffice?: string | null;
  nwsGridX?: number | null;
  nwsGridY?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class SailingPortService {
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
      windDirection: this.getWindDirection(port),
      windSpeed: this.getWindSpeed(port),
      currentSpeed: this.getCurrentSpeed(port),
      gusts: this.getGusts(port),
      waveHeight: this.getWaveHeight(port),
      waterTemp: this.getWaterTemp(port),
      tide: this.getTide(port),
      forecast: this.getForecast(port),
      time: this.getTime(port),
    }));
  }

  getPorts(): Observable<SailingPort[]> {
    return this.httpClient.get<SailingPort[]>(this.apiUrl);
  }

  createPort(port: CreateSailingPortRequest): Observable<SailingPort> {
    return this.httpClient.post<SailingPort>(this.apiUrl, port);
  }

  private getCondition(port: SailingPort): MarineConditionLevel {
    const conditions = port.conditions;
    if (!conditions) {
      return MarineConditionLevel.CALM;
    }

    const weather = conditions.weather?.toLowerCase() ?? '';
    const waveSize = conditions.waveSize ?? 0;
    const windSpeed = conditions.windSpeed ?? 0;
    const gustSpeed = conditions.gustSpeed ?? windSpeed;

    const debugContext = {
      port: port.name,
      windSpeed,
      gustSpeed,
      waveSize,
      weather,
    };

    // 1. Critical Hazards & Marine Alerts
    if (
      weather.includes('thunder') ||
      weather.includes('storm') ||
      windSpeed >= 34 ||
      gustSpeed >= 40
    ) {
      console.debug('[sailing-port-condition]', 'Dangerous due to alert/weather/extreme wind', debugContext);
      return MarineConditionLevel.DANGEROUS;
    }

    if (windSpeed >= 28 || gustSpeed >= 34 || waveSize > 6.0) {
      console.debug('[sailing-port-condition]', 'Hazardous due to extreme wind/wave threshold', debugContext);
      return MarineConditionLevel.HAZARDOUS;
    }

    if (windSpeed >= 22 || gustSpeed >= 28 || waveSize > 4.5) {
      console.debug('[sailing-port-condition]', 'Caution due to elevated wind/wave threshold', debugContext);
      return MarineConditionLevel.CAUTION;
    }

    // 2. Heavy / Brisk Conditions (Reefing required)
    if (windSpeed >= 18 || gustSpeed >= 24 || waveSize > 3.0) {
      console.debug('[sailing-port-condition]', 'Challenging due to heavy wind/wave threshold', debugContext);
      return MarineConditionLevel.CHALLENGING;
    }

    if (windSpeed >= 15 || waveSize > 2.0) {
      console.debug('[sailing-port-condition]', 'Brisk due to wind/wave threshold', debugContext);
      return MarineConditionLevel.BRISK;
    }

    // 3. The Sweet Spot (Ideal / Good)
    if (windSpeed >= 10 && windSpeed <= 14 && waveSize <= 2.0) {
      console.debug('[sailing-port-condition]', 'Ideal due to sweet-spot threshold', debugContext);
      return MarineConditionLevel.IDEAL;
    }

    if (windSpeed >= 8) {
      console.debug('[sailing-port-condition]', 'Good due to moderate wind threshold', debugContext);
      return MarineConditionLevel.GOOD;
    }

    // 4. Light Air & Calm
    if (windSpeed >= 5) {
      console.debug('[sailing-port-condition]', 'Light due to light-air threshold', debugContext);
      return MarineConditionLevel.LIGHT;
    }

    if (windSpeed >= 3) {
      console.debug('[sailing-port-condition]', 'Light airs due to calm threshold', debugContext);
      return MarineConditionLevel.LIGHT_AIRS;
    }

    console.debug('[sailing-port-condition]', 'Calm due to low wind threshold', debugContext);
    return MarineConditionLevel.CALM;
  }

  private getWindDirection(port: SailingPort): string {
    return port.conditions?.windDirection?.trim() || 'n/a';
  }

  private getWindSpeed(port: SailingPort): number {
    return port.conditions?.windSpeed ?? 0;
  }

  private getGusts(port: SailingPort): number {
    return port.conditions?.gustSpeed ?? 0;
  }

  private getCurrentSpeed(port: SailingPort): number | null {
    return port.conditions?.currentSpeed ?? null;
  }

  private getWaveHeight(port: SailingPort): string {
    const waveSize = port.conditions?.waveSize;
    return waveSize == null ? 'n/a' : `${waveSize.toFixed(1)} ft`;
  }

  private getWaterTemp(port: SailingPort): number {
    return port.conditions?.waterTemperature ?? 0;
  }

  private getTide(port: SailingPort): string {
    const tideState = port.conditions?.currentTide ?? 'slack';
    const tideSize = port.conditions?.tideSizeFeet;
    if (tideSize == null) {
      return `${tideState}`;
    }
    return `${tideState} • ${tideSize.toFixed(1)} ft`;
  }

  private getForecast(port: SailingPort): string {
    const weather = port.conditions?.weather ?? 'Unknown';
    const airTemp = port.conditions?.airTemperature;
    if (airTemp == null) {
      return weather;
    }
    return `${weather} • ${airTemp.toFixed(0)}°F`;
  }

  private getTime(port: SailingPort): string {
    const fetchedAt = port.conditions?.fetchedAt;
    if (!fetchedAt) {
      return 'last updated just now';
    }

    const date = new Date(fetchedAt);
    if (Number.isNaN(date.getTime())) {
      return 'last updated just now';
    }

    const time = date
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .replace(/\s+/g, '')
      .toLowerCase();

    const month = date
      .toLocaleDateString('en-US', { month: 'long' })
      .toLowerCase();
    const day = date.getDate();
    const suffix = this.getOrdinalSuffix(day);
    const year = date.getFullYear();

    return `last updated at ${time} on ${month} ${day}${suffix}, ${year}`;
  }

  private getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }

    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
