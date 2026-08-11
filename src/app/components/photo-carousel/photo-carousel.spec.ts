import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoCarousel } from './photo-carousel';

describe('PhotoCarousel', () => {
  let component: PhotoCarousel;
  let fixture: ComponentFixture<PhotoCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCarousel],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCarousel);
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
