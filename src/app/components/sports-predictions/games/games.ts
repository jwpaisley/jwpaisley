import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmptyState } from '../../empty-state/empty-state';

@Component({
  selector: 'jwpaisley-sports-predictions-games',
  standalone: true,
  imports: [CommonModule, EmptyState],
  templateUrl: './games.html',
  styleUrl: './games.scss',
})
export class Games {
  games: unknown[] = [];
}
