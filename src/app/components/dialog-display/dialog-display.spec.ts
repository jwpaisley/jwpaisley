import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDisplay } from './dialog-display';

describe('DialogDisplay', () => {
  let component: DialogDisplay;
  let fixture: ComponentFixture<DialogDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
