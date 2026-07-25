import { Component } from '@angular/core';
import { EmptyState } from '../../empty-state/empty-state';

@Component({
  selector: 'jwpaisley-voyages',
  standalone: true,
  imports: [EmptyState],
  templateUrl: './voyages.html',
  styleUrl: './voyages.scss',
})
export class Voyages {}
