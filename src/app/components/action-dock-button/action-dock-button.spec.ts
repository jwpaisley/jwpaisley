import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDockButton } from './action-dock-button';

describe('ActionDockButton', () => {
  let component: ActionDockButton;
  let fixture: ComponentFixture<ActionDockButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionDockButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDockButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
