import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../helpers/api-url';

export interface SportsPredictionTeam {
  id?: string;
  apiSportsTeamId: number;
  name: string;
  code?: string | null;
  logoUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type Sport = 'SOCCER' | 'FOOTBALL' | 'HOCKEY' | 'BASEBALL' | 'BASKETBALL' | 'F1';

export interface SportsPredictionLeague {
  id?: string;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
  sport: Sport;
  isPrivate: boolean;
  firstPlacePrizeCoins: number;
  secondPlacePrizeCoins: number;
  thirdPlacePrizeCoins: number;
  apiSportsLeagueId: number;
  apiSportsSeasonId: number;
  leagueImageUrl?: string | null;
  leagueStartDate?: string | null;
  leagueEndDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SportsPredictionFixture {
  id?: string;
  apiSportsFixtureId: number;
  apiSportsLeagueId: number;
  apiSportsSeasonId: number;
  homeTeamId: string;
  awayTeamId: string;
  commenceTime?: string | null;
  homeOdds?: number | null;
  awayOdds?: number | null;
  drawOdds?: number | null;
  status?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  winningTeamId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SportsPredictionLeagueParticipant {
  id?: string;
  leagueId: string;
  userId: string;
  points: number;
  joinedAt?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
  profilePictureId?: string | null;
}

export interface SportsPredictionPick {
  id?: string;
  leagueId: string;
  userId: string;
  fixtureId: string;
  selectedTeamId?: string | null;
  isDrawPick: boolean;
  isCorrect: boolean;
  isSettled: boolean;
  payoutMultiplier: number;
  status: string;
  coinsAwarded: number;
  pointsAwarded: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SportsPredictionLeagueUserPointsTotal {
  userId: string;
  totalPoints: number;
}

export interface SportsPredictionPicksPage {
  page: number;
  pageSize: number;
  hasMore: boolean;
  picks: SportsPredictionPick[];
}

export type SportsPredictionFixtureScope = 'ALL' | 'PAST' | 'UPCOMING';

@Injectable({
  providedIn: 'root',
})
export class SportsPredictionService {
  private readonly httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api';
  private readonly apiUrl = getApiUrl(this.localApiUrl, this.prodApiUrl);

  private readonly teamsApiUrl = `${this.apiUrl}/sports-prediction-teams`;
  private readonly leaguesApiUrl = `${this.apiUrl}/sports-prediction-leagues`;
  private readonly fixturesApiUrl = `${this.apiUrl}/sports-prediction-fixtures`;
  private readonly leagueParticipantsApiUrl = `${this.apiUrl}/sports-prediction-league-participants`;
  private readonly picksApiUrl = `${this.apiUrl}/sports-prediction-picks`;

  getTeams(): Observable<SportsPredictionTeam[]> {
    return this.httpClient.get<SportsPredictionTeam[]>(this.teamsApiUrl);
  }

  getTeamsForLeague(leagueId: string): Observable<SportsPredictionTeam[]> {
    return this.httpClient.get<SportsPredictionTeam[]>(`${this.teamsApiUrl}/league/${leagueId}`);
  }

  getTeam(teamId: string): Observable<SportsPredictionTeam> {
    return this.httpClient.get<SportsPredictionTeam>(`${this.teamsApiUrl}/${teamId}`);
  }

  createTeam(team: SportsPredictionTeam): Observable<SportsPredictionTeam> {
    return this.httpClient.post<SportsPredictionTeam>(this.teamsApiUrl, team);
  }

  updateTeam(team: SportsPredictionTeam): Observable<SportsPredictionTeam> {
    return this.httpClient.put<SportsPredictionTeam>(`${this.teamsApiUrl}/${team.id}`, team);
  }

  deleteTeam(teamId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.teamsApiUrl}/${teamId}`);
  }

  getLeagues(): Observable<SportsPredictionLeague[]> {
    return this.httpClient.get<SportsPredictionLeague[]>(this.leaguesApiUrl);
  }

  getMyLeagues(): Observable<SportsPredictionLeague[]> {
    return this.httpClient.get<SportsPredictionLeague[]>(`${this.leaguesApiUrl}/my`);
  }

  getPastLeagues(): Observable<SportsPredictionLeague[]> {
    return this.httpClient.get<SportsPredictionLeague[]>(`${this.leaguesApiUrl}/past`);
  }

  getOpenLeagues(): Observable<SportsPredictionLeague[]> {
    return this.httpClient.get<SportsPredictionLeague[]>(`${this.leaguesApiUrl}/open`);
  }

  getLeague(leagueId: string): Observable<SportsPredictionLeague> {
    return this.httpClient.get<SportsPredictionLeague>(`${this.leaguesApiUrl}/${leagueId}`);
  }

  createLeague(league: SportsPredictionLeague): Observable<SportsPredictionLeague> {
    return this.httpClient.post<SportsPredictionLeague>(this.leaguesApiUrl, league);
  }

  updateLeague(league: SportsPredictionLeague): Observable<SportsPredictionLeague> {
    return this.httpClient.put<SportsPredictionLeague>(`${this.leaguesApiUrl}/${league.id}`, league);
  }

  deleteLeague(leagueId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.leaguesApiUrl}/${leagueId}`);
  }

  getFixtures(): Observable<SportsPredictionFixture[]> {
    return this.httpClient.get<SportsPredictionFixture[]>(this.fixturesApiUrl);
  }

  getFixturesForLeague(
    leagueId: string,
    scope: SportsPredictionFixtureScope = 'ALL',
    page = 0,
  ): Observable<SportsPredictionFixture[]> {
    return this.httpClient.get<SportsPredictionFixture[]>(
      `${this.fixturesApiUrl}/league/${leagueId}?scope=${scope}&page=${page}`,
    );
  }

  getFixture(fixtureId: string): Observable<SportsPredictionFixture> {
    return this.httpClient.get<SportsPredictionFixture>(`${this.fixturesApiUrl}/${fixtureId}`);
  }

  syncFixturesJob(): Observable<string> {
    return this.httpClient.post(`${this.fixturesApiUrl}/sync-job`, null, {
      responseType: 'text',
    });
  }

  createFixture(fixture: SportsPredictionFixture): Observable<SportsPredictionFixture> {
    return this.httpClient.post<SportsPredictionFixture>(this.fixturesApiUrl, fixture);
  }

  updateFixture(fixture: SportsPredictionFixture): Observable<SportsPredictionFixture> {
    return this.httpClient.put<SportsPredictionFixture>(`${this.fixturesApiUrl}/${fixture.id}`, fixture);
  }

  deleteFixture(fixtureId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.fixturesApiUrl}/${fixtureId}`);
  }

  getLeagueParticipants(): Observable<SportsPredictionLeagueParticipant[]> {
    return this.httpClient.get<SportsPredictionLeagueParticipant[]>(this.leagueParticipantsApiUrl);
  }

  getLeagueParticipant(participantId: string): Observable<SportsPredictionLeagueParticipant> {
    return this.httpClient.get<SportsPredictionLeagueParticipant>(`${this.leagueParticipantsApiUrl}/${participantId}`);
  }

  getParticipantsForLeague(leagueId: string): Observable<SportsPredictionLeagueParticipant[]> {
    return this.httpClient.get<SportsPredictionLeagueParticipant[]>(`${this.leagueParticipantsApiUrl}/league/${leagueId}`);
  }

  createLeagueParticipant(participant: SportsPredictionLeagueParticipant): Observable<SportsPredictionLeagueParticipant> {
    return this.httpClient.post<SportsPredictionLeagueParticipant>(this.leagueParticipantsApiUrl, participant);
  }

  updateLeagueParticipant(participant: SportsPredictionLeagueParticipant): Observable<SportsPredictionLeagueParticipant> {
    return this.httpClient.put<SportsPredictionLeagueParticipant>(`${this.leagueParticipantsApiUrl}/${participant.id}`, participant);
  }

  deleteLeagueParticipant(participantId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.leagueParticipantsApiUrl}/${participantId}`);
  }

  getPicks(): Observable<SportsPredictionPick[]> {
    return this.httpClient.get<SportsPredictionPick[]>(this.picksApiUrl);
  }

  getPick(pickId: string): Observable<SportsPredictionPick> {
    return this.httpClient.get<SportsPredictionPick>(`${this.picksApiUrl}/${pickId}`);
  }

  getLeagueUserTotals(leagueId: string): Observable<SportsPredictionLeagueUserPointsTotal[]> {
    return this.httpClient.get<SportsPredictionLeagueUserPointsTotal[]>(`${this.picksApiUrl}/league/${leagueId}/totals`);
  }

  getRecentPicksForLeague(leagueId: string, page = 0): Observable<SportsPredictionPicksPage> {
    return this.httpClient.get<SportsPredictionPicksPage>(`${this.picksApiUrl}/league/${leagueId}/recent?page=${page}`);
  }

  getMyPicksForLeague(leagueId: string): Observable<SportsPredictionPick[]> {
    return this.httpClient.get<SportsPredictionPick[]>(`${this.picksApiUrl}/league/${leagueId}/mine`);
  }

  getMyPickForLeagueFixture(leagueId: string, fixtureId: string): Observable<SportsPredictionPick> {
    return this.httpClient.get<SportsPredictionPick>(`${this.picksApiUrl}/league/${leagueId}/fixture/${fixtureId}/mine`);
  }

  createPick(pick: SportsPredictionPick): Observable<SportsPredictionPick> {
    return this.httpClient.post<SportsPredictionPick>(this.picksApiUrl, pick);
  }

  updatePick(pick: SportsPredictionPick): Observable<SportsPredictionPick> {
    return this.httpClient.put<SportsPredictionPick>(`${this.picksApiUrl}/${pick.id}`, pick);
  }

  deletePick(pickId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.picksApiUrl}/${pickId}`);
  }
}
