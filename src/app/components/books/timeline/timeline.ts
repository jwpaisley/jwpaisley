import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Book, BookReadState, BooksService } from '../../../services/books-service/books-service';
import { BookCard } from '../book-card/book-card';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Loader } from '../../loader/loader';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'jwpaisley-timeline',
  imports: [BookCard, Loader, CommonModule, AsyncPipe],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline implements OnInit, OnDestroy {
  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected books: Book[] = [];
  protected groupedFinishedBooks: { label: string; books: Book[] }[] = [];

  constructor(
    private booksService: BooksService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  protected get finishedBooks(): Book[] {
    return this.books;
  }

  protected sortFinishedBooksByFinishDate(books: Book[]): Book[] {
    return books
      .filter((book) => book.state === BookReadState.FINISHED_READING)
      .sort((a, b) => {
        const da = a.finishDate ? Date.parse(a.finishDate) : 0;
        const db = b.finishDate ? Date.parse(b.finishDate) : 0;
        return db - da;
      });
  }

  protected groupFinishedBooksByMonth(books: Book[]): { label: string; books: Book[] }[] {
    const sortedBooks = this.sortFinishedBooksByFinishDate(books);
    const groups = new Map<string, { label: string; books: Book[] }>();

    sortedBooks.forEach((book) => {
      const date = book.finishDate ? new Date(book.finishDate) : null;
      if (!date || Number.isNaN(date.getTime())) {
        return;
      }

      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const existingGroup = groups.get(monthKey);

      if (existingGroup) {
        existingGroup.books.push(book);
      } else {
        groups.set(monthKey, {
          label: `${date.toLocaleString('en', { month: 'long' }).toLowerCase()} ${date.getFullYear()}`,
          books: [book],
        });
      }
    });

    return Array.from(groups.values());
  }

  protected getFinishedBooks() {
    this.isLoading = true;
    this.booksService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books: Book[]) => {
          this.books = this.sortFinishedBooksByFinishDate(books);
          this.groupedFinishedBooks = this.groupFinishedBooksByMonth(books);

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.toastService.addToast('failed to load books. please try again later.', 'error', 'danger');
          console.error(error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnInit(): void {
    this.getFinishedBooks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
