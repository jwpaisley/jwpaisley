import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export declare enum BookReadState {
  WANT_TO_READ = 'wantToRead',
  CURRENTLY_READING = 'currentlyReading',
  FINISHED_READING = 'finishedReading',
}

export declare interface Book {
  id: string;
  name: string;
  coverUrl: string;
  description: string;
  state: BookReadState;

  rating?: number;
  review?: string;
  startDate?: string;
  finishDate?: string;

  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api/books';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api/books';
  private readonly apiUrl = this.prodApiUrl;

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}`);
  }
}
