import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRadioButtonGroup } from './form-radio-button-group';

describe('FormRadioButtonGroup', () => {
  let component: FormRadioButtonGroup;
  let fixture: ComponentFixture<FormRadioButtonGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRadioButtonGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRadioButtonGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
