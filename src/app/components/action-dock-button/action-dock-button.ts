import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const BUTTON_VARIANTS = [
  'primary', 
  'secondary',
  'success', 
  'warning', 
  'danger'
] as const;

type ButtonVariant = typeof BUTTON_VARIANTS[number];  

@Component({
  selector: 'jwpaisley-action-dock-button',
  imports: [MatIconModule],
  templateUrl: './action-dock-button.html',
  styleUrl: './action-dock-button.scss',
})
export class ActionDockButton {
  @Input() icon: string = 'add';
  @Input() variant: ButtonVariant = 'primary';
  @Output() click = new EventEmitter<void>();
  
  onClick(event: Event) {
    event.stopPropagation();
    this.click.emit();
  }
}
