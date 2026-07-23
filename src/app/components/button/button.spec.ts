import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit click when disabled', () => {
    component.disabled = true;
    const clickSpy = jasmine.createSpy('clickSpy');

    component.click.subscribe(clickSpy);
    component.onClick(new Event('click'));

    expect(clickSpy).not.toHaveBeenCalled();
  });
});
