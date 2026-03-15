import { Component, Input } from '@angular/core';

export declare interface RatingStateGrade {
  emoji: string;
  min: number;
  max: number;
}

const RATING_STATE_GRADES: RatingStateGrade[] = [
  { emoji: '🗑️', min: 0, max: 49 },
  { emoji: '😢', min: 50, max: 59 },
  { emoji: '🙁', min: 60, max: 69 },
  { emoji: '😐', min: 70, max: 79 },
  { emoji: '😊', min: 80, max: 89 },
  { emoji: '🔥', min: 90, max: 94 },
  { emoji: '⭐', min: 95, max: 100 },
];

@Component({
  selector: 'jwpaisley-rating-state',
  imports: [],
  templateUrl: './rating-state.html',
  styleUrl: './rating-state.scss',
})
export class RatingState {
  @Input() value: number = 0;

  protected get ratingEmoji(): string {
    for (const grade of RATING_STATE_GRADES) {
      if (this.value >= grade.min && this.value <= grade.max) {
        return grade.emoji;
      }
    }
    return '❓';
  }
}
