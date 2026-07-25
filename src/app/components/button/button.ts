import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, RouterLink],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() text: string = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled: boolean = false;
  @Input() routerLink: string | any[] | null = null;
  @Output() click = new EventEmitter<void>();
  
  onClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.routerLink) {
      return; // Let the router handle the navigation
    }

    event.stopPropagation();
    this.click.emit();
  }
}
