import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { DashboardCard, DashboardItem } from '../../components/dashboard-card/dashboard-card';
import { shuffle } from '../../../utils/shuffle';

const NG_COMPONENT_IMPORTS = [
  CommonModule, 
  DashboardCard,
];

const GREETINGS = [
  "welcome to paisley's whimsy den.",
  "goose says hello 🐶"
];

const DASHBOARD_ITEMS: DashboardItem[] = [
  {
    title: 'recipes',
    icon: 'restaurant',
    description: "my personal library of culinary alchemy. don't burn off your eyebrows.",
    link: '/recipes',
  },
  { 
    title: 'treat goose', 
    icon: 'pets', 
    description: "he's been a good boy. he deserves it.", 
    link: '/treat-goose', 
  },
  { 
    title: 'photography', 
    icon: 'camera_alt', 
    description: "sometimes i take pictures of things, check them out here.", 
    link: '/photos', 
  },
  { 
    title: 'would you rather', 
    icon: 'question_mark', 
    description: "make tough choices between two equally enticing scenarios.", 
    link: '/would-you-rather', 
  },
  { 
    title: 'meal planning + prep', 
    icon: 'bento', 
    description: "tool for planning out meals and nutrition for a week.", 
    link: '/meal-planning', 
  },
  { 
    title: "what i'm reading", 
    icon: 'library_books', 
    description: "my personal library... includes a timeline and ratings.", 
    link: '/library', 
  },
  { 
    title: 'chameleon', 
    icon: 'sports_esports', 
    description: "a game where you try to blend in... or spot the imposter.", 
    link: '/chameleon',
  },
  
];

@Component({
  selector: 'jwpaisley-home',
  imports: NG_COMPONENT_IMPORTS,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private breakpointObserver = inject(BreakpointObserver);

  columns$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(({ matches }) => {
        if (this.breakpointObserver.isMatched(Breakpoints.Handset)) return 1;
        if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) return 2;
        return 3;
      })
    );

  greeting: string = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  dashboardItems: DashboardItem[] = shuffle(DASHBOARD_ITEMS);

  getDashboardCardTypeByIndex(index: number): 'primary' | 'secondary' | 'tertiary' {
    const types: ('primary' | 'secondary' | 'tertiary')[] = ['primary', 'secondary', 'tertiary'];
    return types[index % types.length];
  }

  getDashboardCardIsTallByIndex(index: number): boolean {
    return index % 4 === 0;
  }
}
