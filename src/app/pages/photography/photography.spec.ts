import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotographyPage } from './photography';

describe('PhotographyPage', () => {
  let component: PhotographyPage;
  let fixture: ComponentFixture<PhotographyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotographyPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotographyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
