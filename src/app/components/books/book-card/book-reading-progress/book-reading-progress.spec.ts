import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReadingProgress } from './book-reading-progress';

describe('BookReadingProgress', () => {
  let component: BookReadingProgress;
  let fixture: ComponentFixture<BookReadingProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReadingProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookReadingProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
