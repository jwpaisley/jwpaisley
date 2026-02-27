import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeReviews } from './recipe-reviews';

describe('RecipeReviews', () => {
  let component: RecipeReviews;
  let fixture: ComponentFixture<RecipeReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
