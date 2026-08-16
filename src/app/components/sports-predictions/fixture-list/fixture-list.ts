import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Button } from '../../button/button';
import { SportsPredictionFixture } from '../../../services/sports-prediction-service/sports-prediction-service';
import { Fixture } from '../fixture/fixture';

@Component({
  selector: 'jwpaisley-fixture-list',
  standalone: true,
  imports: [CommonModule, Button, Fixture],
  templateUrl: './fixture-list.html',
  styleUrl: './fixture-list.scss',
})
export class FixtureList {
  @Input() fixtures: SportsPredictionFixture[] = [];
  @Input() teamNameById: Record<string, string> = {};
  @Input() teamLogoById: Record<string, string> = {};
  @Input() maxFixturesToShow = 5;

  showAll = false;

  get visibleFixtures(): SportsPredictionFixture[] {
    if (this.showAll || this.fixtures.length <= this.maxFixturesToShow) {
      return this.fixtures;
    }

    return this.fixtures.slice(0, this.maxFixturesToShow);
  }

  get hasMoreFixtures(): boolean {
    return this.fixtures.length > this.maxFixturesToShow;
  }

  toggleShowMore(): void {
    this.showAll = !this.showAll;
  }
}
