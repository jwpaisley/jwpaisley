import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'jwpaisley-card-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-grid.html',
  styleUrl: './card-grid.scss',
})
export class CardGrid {
  @Input() largeColumns = 3;
  @Input() mediumColumns = 2;
  @Input() smallColumns = 1;

  get gridStyle(): Record<string, string> {
    return {
      '--grid-large': String(this.largeColumns),
      '--grid-medium': String(this.mediumColumns),
      '--grid-small': String(this.smallColumns),
    };
  }
}
