import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Book, BookReadState, BooksService } from '../../../services/books-service/books-service';
import { BookReadingProgress } from './book-reading-progress/book-reading-progress';
import { timestampToDateString } from '../../../helpers/date-helper';
import { UserService } from '../../../services/user-service/user-service';
import { Button } from '../../button/button';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { ToastService } from '../../../services/toast-service/toast-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../../form-input/form-input';
import { FormTextArea } from '../../form-text-area/form-text-area';
import { FormDatepicker } from '../../form-datepicker/form-datepicker';
import { FormRadioButtonGroup } from '../../form-radio-button-group/form-radio-button-group';
import { FormRadioButtonOption } from '../../form-radio-button-option/form-radio-button-option';
import { RatingInput } from '../../rating-input/rating-input';

const NG_COMPONENT_IMPORTS = [
  AsyncPipe, 
  CommonModule, 
  LayoutModule, 
  BookReadingProgress, 
  Button, 
  FormInput, 
  FormTextArea, 
  FormDatepicker,
  FormRadioButtonGroup,
  FormRadioButtonOption,
  RatingInput,
  ReactiveFormsModule
];

@Component({
  selector: 'jwpaisley-book-card',
  standalone: true,
  imports: NG_COMPONENT_IMPORTS,
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard implements OnInit, OnDestroy {
  @Input({ required: true }) book!: Book;
  @Input() editMode = false;
  
  private breakpointObserver = inject(BreakpointObserver);
  private formBuilder = inject(FormBuilder);

  protected isLoading = false;
  protected isUserAdmin = false;
  protected destroy$ = new Subject<void>();
  protected formGroup?: FormGroup;

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

  constructor(
    private bookService: BooksService,
    private dialogService: DialogService,
    private toastService: ToastService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isUserAdmin = this.userService.isUserAdmin();
        this.cdr.detectChanges();
      });

    this.formGroup = this.buildFormGroup(this.book);

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValue => {
        this.cdr.detectChanges();
      });

    if (this.isNewBook) {
      this.editMode = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isNewBook(): boolean {
    return this.book.id === 'new';
  }

  protected get wantToRead() {
    if (this.editMode) {
      return this.formGroup?.get('state')?.value === BookReadState.WANT_TO_READ;
    } else {
      return this.book.state === BookReadState.WANT_TO_READ;
    }
  }

  protected get currentlyReading() {
    if (this.editMode) {
      return this.formGroup?.get('state')?.value === BookReadState.CURRENTLY_READING;
    } else {
      return this.book.state === BookReadState.CURRENTLY_READING;
    }
  }

  protected get finished() {
    if (this.editMode) {
      return this.formGroup?.get('state')?.value === BookReadState.FINISHED_READING;
    } else {
      return this.book.state === BookReadState.FINISHED_READING;
    }
  }

  protected editButtonClicked(): void {
    this.editMode = true;
    this.cdr.detectChanges();
  }

  protected async saveButtonClicked(): Promise<void> {
    const result = await this.dialogService.openConfirmDialog({
      title: 'save book',
      text: 'are you sure you want to save this book?',
      confirmLabel: 'save',
      cancelLabel: 'cancel',
    });

    if (result.confirmed) {
      this.isLoading = true;
      
      const bookToSave = this.bookFromForm();

      if (this.isNewBook) {
        if (this.isNewBook) {
          bookToSave.id = '';
        }

        console.log(bookToSave);

        this.bookService.createBook(bookToSave)
          .subscribe({
            next: (createdBook: Book) => {
              this.book = createdBook;
              this.isLoading = false;
              this.editMode = false;
              this.toastService.addToast('book created successfully', 'check', 'success');
            }, 
            error: () => {
              this.isLoading = false;
              this.toastService.addToast('failed to create book', 'error', 'danger');
            }
          });
      } else {
        this.bookService.updateBook(bookToSave)
          .subscribe({
            next: (updatedBook: Book) => {
              this.book = updatedBook;
              this.isLoading = false;
              this.editMode = false;
              this.toastService.addToast('book updated successfully', 'check', 'success');
            },
            error: () => {
              this.isLoading = false;
              this.toastService.addToast('failed to update book', 'error', 'danger');
            }
          });
      }
    }
  }

  protected async deleteButtonClicked(): Promise<void> {
    const result = await this.dialogService.openConfirmDialog({
      title: 'delete book',
      text: 'are you sure you want to delete this book?',
      confirmLabel: 'delete',
      cancelLabel: 'cancel',
    });

    if (result.confirmed) {
      this.isLoading = true;

      this.bookService.deleteBook(this.book.id)
        .subscribe({
          next: () => {
            this.toastService.addToast('book deleted successfully', 'check', 'success');
          },
          error: () => {
            this.isLoading = false;
            this.toastService.addToast('failed to delete book', 'error', 'danger');
          }
        });
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => this.book.coverImage = e.target?.result as string;
      reader.readAsDataURL(file);

      this.bookService.uploadCover(file).subscribe({
        next: (response) => {
          console.log(response);
          this.formGroup?.patchValue({ coverImage: response.url });
          this.book.coverImage = response.url;
        },
        error: (err) => console.error("Upload failed", err)
      });
    }
  }

  private bookFromForm(): Book {
    const formValue = this.formGroup?.value;

    return {
      ...this.book,
      ...formValue
    };
  }

  protected cancelButtonClicked(): void {
    this.editMode = false;
    this.syncForm(this.book);
    this.cdr.detectChanges();
  }

  private buildFormGroup(book: Book): FormGroup {
    return this.formBuilder.group({
      title: [book.title, [Validators.required, Validators.minLength(1)]],
      author: [book.author, [Validators.required, Validators.minLength(1)]],
      coverImage: [book.coverImage, Validators.required],
      description: [book.description, Validators.required],
      state: [book.state, Validators.required],

      pageCount: [book.pageCount],
      currentPage: [book.currentPage],
      rating: [book.rating],
      review: [book.review],
      startDate: [book.startDate],
      finishDate: [book.finishDate],
    });
  }

  private syncForm(book: Book): void {
    this.formGroup?.reset(book);
  }

  protected formatDate(timestamp: string | undefined): string {
    if (!timestamp) return '-';

    return timestampToDateString(timestamp);
  }
}