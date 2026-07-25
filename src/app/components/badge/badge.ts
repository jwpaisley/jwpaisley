import { Component, Input } from '@angular/core';

@Component({
  selector: 'jwpaisley-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  @Input() text: string = '';
}
