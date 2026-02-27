import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipePhotoCarousel } from './recipe-photo-carousel';

describe('RecipePhotoCarousel', () => {
  let component: RecipePhotoCarousel;
  let fixture: ComponentFixture<RecipePhotoCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipePhotoCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipePhotoCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
