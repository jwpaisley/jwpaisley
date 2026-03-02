import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextArea } from './form-text-area';

describe('FormTextArea', () => {
  let component: FormTextArea;
  let fixture: ComponentFixture<FormTextArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTextArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTextArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
