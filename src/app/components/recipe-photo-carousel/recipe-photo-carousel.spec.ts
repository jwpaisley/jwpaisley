import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipePhotoCarousel } from './recipe-photo-carousel';

describe('RecipePhotoCarousel', () => {
  let component: RecipePhotoCarousel;
  let fixture: ComponentFixture<RecipePhotoCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipePhotoCarousel],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipePhotoCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows navigation controls when more than one image is provided', () => {
    component.photoUrls = ['one.jpg', 'two.jpg'];
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('wraps to the first image after advancing past the last one', () => {
    component.photoUrls = ['one.jpg', 'two.jpg'];
    component.currentIndex = 1;
    component.goToNext();

    expect(component.currentIndex).toBe(0);
  });
});
