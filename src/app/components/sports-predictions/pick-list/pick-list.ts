import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input() maxPicksToShow = 5;

  showAll = false;

  get visiblePicks(): DisplayPick[] {
    if (this.showAll || this.picks.length <= this.maxPicksToShow) {
      return this.picks;
    }

    return this.picks.slice(0, this.maxPicksToShow);
  }

  get hasMorePicks(): boolean {
    return !this.showAll && this.picks.length > this.maxPicksToShow;
  }

  toggleShowMore(): void {
    this.showAll = true;
  }
}
