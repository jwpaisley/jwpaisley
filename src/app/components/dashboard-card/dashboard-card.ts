import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jwpaisley-dashboard-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './dashboard-card.html',
  styleUrls: ['./dashboard-card.scss']
})
export class DashboardCard {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) icon!: string;
  @Input() description?: string;
  @Input() link?: string;
  @Input() type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() isTall: boolean = false;
}