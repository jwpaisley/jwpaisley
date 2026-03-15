import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRadioButtonOption } from './form-radio-button-option';

describe('FormRadioButtonOption', () => {
  let component: FormRadioButtonOption;
  let fixture: ComponentFixture<FormRadioButtonOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRadioButtonOption]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRadioButtonOption);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
