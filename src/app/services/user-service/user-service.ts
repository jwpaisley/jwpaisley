import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export declare interface User {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_STORAGE_KEY = 'jwpaisley.user_info';
  private readonly USER_STORAGE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly ADMIN_EMAILS = new Set<string>([
    "jacobpaisley97@gmail.com",
  ]);

  private userSubject = new BehaviorSubject<User | undefined>(this.getUserInfoFromLocalStorage());
  public user$: Observable<User | undefined> = this.userSubject.asObservable();
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

  /**
   * Accepts a Google OAuth token, decodes it to extract user information, and saves it to local storage.
   * @param token 
   * @returns A boolean representing login success status.
   */
  performLogin(token: string): boolean {
    const user = this.decodeOAuthToken(token);

    if (user) {
      this.saveUserInfoToLocalStorage(user);
      return true;
    } else {
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
