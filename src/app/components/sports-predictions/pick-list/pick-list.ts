import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../button/button';
import { Pick } from '../pick/pick';

export interface DisplayPick {
  id: string;
  pickerName: string;
  pickerImageUrl?: string | null;
  fixtureLabel: string;
  pickLabel: string;
  payoutPoints: number;
  status: string;
  createdAt?: string | null;
}

@Component({
  selector: 'jwpaisley-pick-list',
  standalone: true,
  imports: [CommonModule, Button, Pick],
  templateUrl: './pick-list.html',
  styleUrl: './pick-list.scss',
})
export class PickList {
  @Input() picks: DisplayPick[] = [];
  @Input() hasMorePicks = false;
  @Input() isLoadingMore = false;
  @Output() showMoreRequested = new EventEmitter<void>();

  requestShowMore(): void {
    if (this.isLoadingMore || !this.hasMorePicks) {
      return;
    }

    this.showMoreRequested.emit();
  }
}
