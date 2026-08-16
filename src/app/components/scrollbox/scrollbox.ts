import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'jwpaisley-scrollbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrollbox.html',
  styleUrl: './scrollbox.scss',
})
export class Scrollbox {
  @Input() maxHeightRem = 24;
}
