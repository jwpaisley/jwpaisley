import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActionsService, ActionType } from '../../services/actions-service/actions-service';

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
  @Input() action: ActionType = 'add';

  constructor(
    private actionsService: ActionsService
  ) {}
  
  onClick() {
    this.actionsService.emitAction({
      type: this.action
    })
  }
}
