import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { getApiUrl } from '../../helpers/api-url';

export interface UserPage {
  items: User[];
  nextPageToken: string | null;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  token: string;
  lastLogin?: string;
  updatedAt?: string;
  createdAt?: string;
  emailAddress?: string;
  profilePictureUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_STORAGE_KEY = 'jwpaisley.user_info';
  private readonly USER_STORAGE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly ADMIN_EMAILS = new Set<string>(['jacobpaisley97@gmail.com']);
  private readonly localApiUrl = 'http://localhost:8080/api';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api';
  private readonly apiUrl = getApiUrl(this.localApiUrl, this.prodApiUrl);

  private userSubject = new BehaviorSubject<User | undefined>(this.getUserInfoFromLocalStorage());
  public user$: Observable<User | undefined> = this.userSubject.asObservable();
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.getUserInfoFromLocalStorage();
      if (user) {
        this.userSubject.next(user);
      }
    }
  }

  /**
   * Decode a Google OAuth token to extract user information.
   * @param token 
   * @returns 
   */
  decodeOAuthToken(token: string): User | undefined {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);

      return {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        imageUrl: payload.picture,
        token: token,
        lastLogin: undefined,
        updatedAt: undefined,
        createdAt: undefined,
      }
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Saves user information to local storage.
   * @param user 
   */
  saveUserInfoToLocalStorage(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      const sessionData = {
        user,
        expiry: new Date().getTime() + this.USER_STORAGE_DURATION,
      };

      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(sessionData));

      this.userSubject.next(user);
    }
  }

  /**
   * Retrieves user information from local storage if it exists and is not expired.
   * @returns User information or undefined if not found or expired.
   */
  getUserInfoFromLocalStorage(): User | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const sessionDataString = localStorage.getItem(this.USER_STORAGE_KEY);
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        if (new Date().getTime() < sessionData.expiry) {
          return sessionData.user;
        } else {
          localStorage.removeItem(this.USER_STORAGE_KEY);
        }
      }
    }

    return undefined;
  }

  /**
   * Check whether the current user is logged in by verifying if valid user information exists in local storage.
   * @returns A boolean indicating whether the user is logged in or not.
   */
  isUserLoggedIn(): boolean {
    return this.getUserInfoFromLocalStorage() !== undefined;
  }

  /**
   * Check whether the current user is an admin by verifying if the user's email is contained
   * in the admin email set.
   */
  isUserAdmin(): boolean {
    const user: User | undefined = this.getUserInfoFromLocalStorage();
    return user ? this.ADMIN_EMAILS.has(user.email) : false;
  }   

  private normalizeUser(user: Partial<User> & { id?: string; emailAddress?: string; profilePictureUrl?: string; imageUrl?: string; email?: string; token?: string }): User {
    return {
      id: user.id,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? user.emailAddress ?? '',
      imageUrl: user.imageUrl ?? user.profilePictureUrl ?? '',
      token: user.token ?? '',
      lastLogin: user.lastLogin,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      emailAddress: user.emailAddress,
      profilePictureUrl: user.profilePictureUrl,
    };
  }

  /**
   * Exchanges the Google OAuth credential with the API for a JWT-backed session.
   * @param token 
   * @returns A boolean representing login success status.
   */
  getUsers(pageToken?: string): Observable<UserPage> {
    let params = new HttpParams();

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.http.get<any>(`${this.apiUrl}/users`, { params }).pipe(
      map((page: any) => ({
        items: (page?.items ?? []).map((user: any) => this.normalizeUser(user)),
        nextPageToken: page?.nextPageToken ?? null,
      }))
    );
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`).pipe(
      map((user: any) => this.normalizeUser({
        ...user,
        email: user.emailAddress || user.email,
        imageUrl: user.profilePictureUrl || user.imageUrl,
      }))
    );
  }

  async performLogin(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/auth/login`, { credential: token }));
      const backendUser = response?.user;

      if (backendUser) {
        const user: User = this.normalizeUser({
          ...backendUser,
          email: backendUser.emailAddress || backendUser.email,
          imageUrl: backendUser.profilePictureUrl || backendUser.imageUrl,
          token: response.token,
        });

        this.saveUserInfoToLocalStorage(user);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Logs the user out by removing their information from local storage.
   */
  performLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.USER_STORAGE_KEY);
      this.userSubject.next(undefined);
    }
  }
}
