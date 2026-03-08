import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WantToRead } from './want-to-read';

describe('WantToRead', () => {
  let component: WantToRead;
  let fixture: ComponentFixture<WantToRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WantToRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WantToRead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
