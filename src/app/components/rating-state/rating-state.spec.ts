import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingState } from './rating-state';

describe('RatingState', () => {
  let component: RatingState;
  let fixture: ComponentFixture<RatingState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
