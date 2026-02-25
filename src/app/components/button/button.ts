import { Component, Input, Output, EventEmitter } from '@angular/core';

const BUTTON_VARIANTS = [
  'primary', 
  'secondary',
  'success', 
  'warning', 
  'danger'
] as const;

type ButtonVariant = typeof BUTTON_VARIANTS[number];  

@Component({
  selector: 'jwpaisley-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() text: string = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Output() click = new EventEmitter<void>();
  
  onClick(event: Event) {
    event.stopPropagation();
    this.click.emit();
  }
}
