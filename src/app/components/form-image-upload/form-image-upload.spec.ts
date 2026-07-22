import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormImageUpload } from './form-image-upload';

describe('FormImageUpload', () => {
  let component: FormImageUpload;
  let fixture: ComponentFixture<FormImageUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormImageUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(FormImageUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
