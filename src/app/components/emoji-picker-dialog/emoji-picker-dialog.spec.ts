import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiPickerDialog } from './emoji-picker-dialog';

describe('EmojiPickerDialog', () => {
  let component: EmojiPickerDialog;
  let fixture: ComponentFixture<EmojiPickerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiPickerDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmojiPickerDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
