import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Book, BookReadState, BooksService } from '../../../services/books-service/books-service';
import { BookCard } from '../book-card/book-card';
import { ActionsService, Action } from '../../../services/actions-service/actions-service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Loader } from '../../loader/loader';

const BOOK_TEMPLATE: Book = {
  id: 'new',
  title: '',
  author: '',
  coverImage: 'https://storage.googleapis.com/jwpaisley-book-covers/generic_book_cover.png',
  description: '',

  pageCount: 1,
  currentPage: 0,
  rating: 0,
  review: '',
  startDate: undefined,
  finishDate: undefined,

  state: BookReadState.CURRENTLY_READING,
}

@Component({
  selector: 'jwpaisley-reading',
  imports: [BookCard, Loader],
  templateUrl: './reading.html',
  styleUrl: './reading.scss',
})
export class Reading implements OnInit, OnDestroy {
  @Input() addingBook: boolean = false;

  protected isLoading = false;
  protected destroy$ = new Subject<void>();
  protected books: Book[] = [];

  constructor(
    private actionsService: ActionsService,
    private booksService: BooksService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  protected get readingBooks(): Book[] {
    return this.books;
  }

  protected getReadingBooks() {
    this.isLoading = true;
    this.booksService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books: Book[]) => {
          this.books = books.filter(book => book.state === BookReadState.CURRENTLY_READING);
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
    this.getReadingBooks();
    
    this.actionsService.actionEmitted$
      .pipe(takeUntil(this.destroy$))
      .subscribe((action: Action) => {
        if (action.type === 'add') {
          this.addBook();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addBook() {
    this.books.push(BOOK_TEMPLATE);
    this.cdr.detectChanges();
  }
}
