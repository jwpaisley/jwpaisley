import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export enum BookReadState {
  WANT_TO_READ = 'wantToRead',
  CURRENTLY_READING = 'currentlyReading',
  FINISHED_READING = 'finishedReading',
}

export declare interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  state: BookReadState;

  pageCount?: number;
  currentPage?: number;
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

  createBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(`${this.apiUrl}`, book);
  }

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}`);
  }

  getBook(bookId: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/${bookId}`);
  }

  updateBook(book: Book): Observable<Book> {
    return this.httpClient.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  deleteBook(bookId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${bookId}`);
  }

  uploadCover(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    
    formData.append('cover', file);

    return this.httpClient.post<{ url: string }>(
      'https://api.jwpaisley.com/api/book-covers', 
      formData
    );
  }
}
