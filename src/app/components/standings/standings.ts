import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface StandingsItem {
  label: string;
  imageUrl?: string | null;
  points: number;
}

@Component({
  selector: 'jwpaisley-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standings.html',
  styleUrl: './standings.scss',
})
export class Standings implements OnInit {
  @Input() standings: StandingsItem[] = [];

  get sortedStandings(): StandingsItem[] {
    return [...this.standings].sort((a, b) => b.points - a.points);
  }

  ngOnInit(): void {
    this.standings = this.sortedStandings;
  }

  getPlacePrefix(index: number): string {
    if (index === 0) {
      return '🥇';
    }

    if (index === 1) {
      return '🥈';
    }

    if (index === 2) {
      return '🥉';
    }

    return '▪️';
  }

  getPlaceLabel(index: number): string {
    return `${this.getPlacePrefix(index)} ${index + 1}`;
  }

  getInitials(label: string): string {
    const words = label
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (words.length === 0) {
      return '?';
    }

    return words.map((word) => word.charAt(0).toUpperCase()).join('');
  }
}
