import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../button/button';
import { SportsPredictionFixture } from '../../../services/sports-prediction-service/sports-prediction-service';
import { Fixture, FixturePickOption, FixturePickRequest } from '../fixture/fixture';

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
  @Input() selectedPickOptionByFixtureId: Record<string, FixturePickOption> = {};
  @Input() maxFixturesToShow = 5;
  @Output() pickRequested = new EventEmitter<FixturePickRequest>();

  showAll = false;

  get visibleFixtures(): SportsPredictionFixture[] {
    if (this.showAll || this.fixtures.length <= this.maxFixturesToShow) {
      return this.fixtures;
    }

    return this.fixtures.slice(0, this.maxFixturesToShow);
  }

  get hasMoreFixtures(): boolean {
    return !this.showAll && this.fixtures.length > this.maxFixturesToShow;
  }

  toggleShowMore(): void {
    this.showAll = true;
  }

  onPickRequested(pickRequest: FixturePickRequest): void {
    this.pickRequested.emit(pickRequest);
  }

  getSelectedPickOption(fixtureId?: string): FixturePickOption | null {
    if (!fixtureId) {
      return null;
    }

    return this.selectedPickOptionByFixtureId[fixtureId.trim().toLowerCase()] ?? null;
  }
}
