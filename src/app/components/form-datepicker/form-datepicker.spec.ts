import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatepicker } from './form-datepicker';

describe('FormDatepicker', () => {
  let component: FormDatepicker;
  let fixture: ComponentFixture<FormDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDatepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
