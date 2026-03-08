import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDock } from './action-dock';

describe('ActionDock', () => {
  let component: ActionDock;
  let fixture: ComponentFixture<ActionDock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionDock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
