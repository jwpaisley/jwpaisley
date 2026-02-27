import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSummary } from './recipe-summary';

describe('RecipeSummary', () => {
  let component: RecipeSummary;
  let fixture: ComponentFixture<RecipeSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
