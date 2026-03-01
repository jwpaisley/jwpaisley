import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service/toast-service';
import { MatIconModule } from '@angular/material/icon';

// toast-container.component.ts
@Component({
  selector: 'jwpaisley-toast-container',
  imports: [MatIconModule],
  templateUrl: './toast-display.html',
  styleUrl: './toast-display.scss',
  standalone: true,
})
export class ToastDisplay {
  constructor(protected toastService: ToastService) {}
}