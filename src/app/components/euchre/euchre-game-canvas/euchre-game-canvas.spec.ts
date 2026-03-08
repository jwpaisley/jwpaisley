import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuchreGameCanvas } from './euchre-game-canvas';

describe('EuchreGameCanvas', () => {
  let component: EuchreGameCanvas;
  let fixture: ComponentFixture<EuchreGameCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EuchreGameCanvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EuchreGameCanvas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
