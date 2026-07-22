import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCollectionDialog } from './add-collection-dialog';

describe('AddCollectionDialog', () => {
  let component: AddCollectionDialog;
  let fixture: ComponentFixture<AddCollectionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollectionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCollectionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
