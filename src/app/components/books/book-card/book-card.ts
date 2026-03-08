import { Component, Input, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Book, BookReadState } from '../../../services/books-service/books-service';
import { BookReadingProgress } from './book-reading-progress/book-reading-progress';
import { timestampToDateString } from '../../../helpers/date-helper';

@Component({
  selector: 'jwpaisley-book-card',
  standalone: true,
  imports: [AsyncPipe, CommonModule, LayoutModule, BookReadingProgress],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  @Input({ required: true }) book!: Book;

  private breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

  protected get wantToRead() {
    return this.book.state === BookReadState.WANT_TO_READ;
  }

  protected get currentlyReading() {
    return this.book.state === BookReadState.CURRENTLY_READING;
  }

  protected get finished() {
    return this.book.state === BookReadState.FINISHED_READING;
  }

  protected formatDate(timestamp: string | undefined): string {
    if (!timestamp) return '-';

    return timestampToDateString(timestamp);
  }
}