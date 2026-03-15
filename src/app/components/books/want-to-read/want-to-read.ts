import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Book, BookReadState, BooksService } from '../../../services/books-service/books-service';
import { BookCard } from '../book-card/book-card';
import { ActionsService, Action } from '../../../services/actions-service/actions-service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';

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

  state: BookReadState.WANT_TO_READ,
}

@Component({
  selector: 'app-want-to-read',
  imports: [BookCard],
  templateUrl: './want-to-read.html',
  styleUrl: './want-to-read.scss',
})
export class WantToRead implements OnInit, OnDestroy {
  @Input() addingBook: boolean = false;

  protected destroy$ = new Subject<void>();
  protected books: Book[] = [];

  constructor(
    private actionsService: ActionsService,
    private booksService: BooksService,
    private cdr: ChangeDetectorRef,
  ) {}

  protected get wantToReadBooks(): Book[] {
    return this.books;
  }

  protected getWantToReadBooks() {
    this.booksService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books: Book[]) => {
        this.books = books.filter(book => book.state === BookReadState.WANT_TO_READ);
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    this.getWantToReadBooks();
    
    this.actionsService.actionEmitted$
      .pipe(takeUntil(this.destroy$))
      .subscribe((action: Action) => {
        if (action.type === 'add') {
          this.addBook();
        } else {
          alert('woops!')
          console.log(action.type)
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
