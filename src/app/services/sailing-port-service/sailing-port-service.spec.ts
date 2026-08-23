import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateSailingPortRequest, SailingPort, SailingPortService } from './sailing-port-service';
import { MarineConditionLevel } from '../../components/sailing/sailing-conditions-card/sailing-conditions-card';

describe('SailingPortService', () => {
  let service: SailingPortService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SailingPortService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps ports into condition cards with a readable title and condition', () => {
    const cards = service.reflect([
      {
        id: 'port-1',
        name: 'Long Beach',
        latitude: 33.76,
        longitude: -118.19,
        conditions: {
          windSpeed: 12,
          windDirection: 250,
          gustSpeed: 16,
          currentSpeed: 1.2,
          currentDirection: 195,
          waveHeight: 1.4,
          wavePeriod: 5.8,
          waterTemperature: 60,
          airTemperature: 67,
          weather: 'PARTLY_SUNNY',
          visibility: 14,
        },
      },
    ]);

    expect(cards.length).toBe(1);
    expect(cards[0].location).toBe('Long Beach');
    expect(cards[0].title).toContain('Long Beach');
    expect(cards[0].condition).toBe(MarineConditionLevel.IDEAL);
  });

  it('uses the latest API conditions when reflecting ports into cards', () => {
    const cards = service.reflect([
      {
        id: 'port-1',
        name: 'Long Beach',
        latitude: 33.76,
        longitude: -118.19,
        conditions: {
          windSpeed: 12,
          windDirection: 250,
          gustSpeed: 16,
          currentSpeed: 1.2,
          currentDirection: 195,
          waveHeight: 1.4,
          wavePeriod: 5.8,
          weather: 'PARTLY_SUNNY',
          airTemperature: 67,
          visibility: 14,
          fetchedAt: '2026-08-01T12:00:00Z',
        },
      },
    ]);

    expect(cards[0].windDirection).toContain('250°');
    expect(cards[0].currentDirection).toContain('195°');
    expect(cards[0].forecast).toContain('Partly Sunny');
    expect(cards[0].visibility).toContain('14.0 km');
    expect(cards[0].windSpeed).toBe(12);
  });

  it('surfaces current speed from API conditions when reflecting cards', () => {
    const cards = service.reflect([
      {
        id: 'port-1',
        name: 'Long Beach',
        latitude: 33.76,
        longitude: -118.19,
        conditions: {
          currentSpeed: 1.2,
        },
      },
    ]);

    expect(cards[0].currentSpeed).toBe(1.2);
  });

  it('formats the fetched timestamp for the card in lowercase local time', () => {
    const cards = service.reflect([
      {
        id: 'port-1',
        name: 'Long Beach',
        latitude: 33.76,
        longitude: -118.19,
        conditions: {
          fetchedAt: '2026-08-01T14:40:00Z',
        },
      },
    ]);

    expect(cards[0].time).toMatch(/^last updated at /i);
    expect(cards[0].time).toContain(' on ');
    expect(cards[0].time).toContain('august');
    expect(cards[0].time).toBe(cards[0].time.toLowerCase());
  });

  it('posts a new port to the API', () => {
    const payload: CreateSailingPortRequest = {
      name: 'Long Beach',
      latitude: 33.76,
      longitude: -118.19,
    };

    let createdPort: SailingPort | undefined;

    service.createPort(payload).subscribe((port) => {
      createdPort = port;
    });

    const req = httpMock.expectOne('http://localhost:8080/api/sailing-ports');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({
      ...payload,
      id: 'port-1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });

    expect(createdPort?.name).toBe('Long Beach');
    expect(createdPort?.id).toBe('port-1');
  });
});
