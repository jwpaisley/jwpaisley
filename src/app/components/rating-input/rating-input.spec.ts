import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingInput } from './rating-input';

describe('RatingInput', () => {
  let component: RatingInput;
  let fixture: ComponentFixture<RatingInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
