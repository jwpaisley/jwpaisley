import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trophies } from './trophies';

describe('Trophies', () => {
  let component: Trophies;
  let fixture: ComponentFixture<Trophies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trophies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trophies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
