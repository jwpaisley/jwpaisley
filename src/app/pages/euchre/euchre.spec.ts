import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Euchre } from './euchre';

describe('Euchre', () => {
  let component: Euchre;
  let fixture: ComponentFixture<Euchre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Euchre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Euchre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
