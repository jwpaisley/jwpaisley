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
    isWorkInProgress: true,
  },
  { 
    title: 'photography', 
    icon: 'camera_alt', 
    description: "sometimes i take pictures of things, check them out here.", 
    link: '/photos', 
    isWorkInProgress: true,
  },
  { 
    title: 'euchre', 
    icon: 'casino', 
    description: "you're not a dubuquer if you can't play euchre.", 
    link: '/euchre', 
    isWorkInProgress: true,
  },
  { 
    title: 'meal planning + prep', 
    icon: 'bento', 
    description: "tool for planning out meals and nutrition for a week.", 
    link: '/meal-planning', 
    isWorkInProgress: true,
  },
  { 
    title: "what i'm reading", 
    icon: 'library_books', 
    description: "my personal library... includes a timeline and ratings.", 
    link: '/library', 
    isWorkInProgress: true,
  },
  { 
    title: 'chameleon', 
    icon: 'sports_esports', 
    description: "a game where you try to blend in... or spot the imposter.", 
    link: '/chameleon',
    isWorkInProgress: true,
  },
  { 
    title: 'workshop', 
    icon: 'carpenter', 
    description: "i make stuff and things out of wood, sometimes. check out my work here.", 
    link: '/workshop',
    isWorkInProgress: true,
  },
  { 
    title: 'cocktails', 
    icon: 'local_bar', 
    description: "a collection of my favorite cocktail recipes, some of my own invention. sláinte.", 
    link: '/cocktails',
    isWorkInProgress: true,
  },
  { 
    title: 'homebrew', 
    icon: 'sports_bar', 
    description: "when you're picky about beer, you learn to make your own. a log of my homebrewing adventures.", 
    link: '/homebrew',
    isWorkInProgress: true,
  },
  { 
    title: 'writing', 
    icon: 'edit_note', 
    description: "a home for my creative writing projects, including short stories, rants, and maybe someday, a novel.", 
    link: '/writing',
    isWorkInProgress: true,
  },
  { 
    title: 'worldbuilding', 
    icon: 'map', 
    description: "for my d+d campaigns and other creative projects, a place to flesh out the lore, geography, and cultures of my fictional works.", 
    link: '/worldbuilding',
    isWorkInProgress: true,
  },
  { 
    title: 'hikes + surveying', 
    icon: 'hiking', 
    description: "sometimes touching grass is necessary. a log of my outdoor adventures and explorations.", 
    link: '/hikes-surveying',
    isWorkInProgress: true,
  },
  { 
    title: 'cheese lab', 
    icon: 'local_pizza', 
    description: "channeling my inner wallace + gromit, experimenting with cheese making.", 
    link: '/cheese-lab',
    isWorkInProgress: true,
  },
  { 
    title: 'events', 
    icon: 'celebration', 
    description: "i like hosting and organizing events for friends and family. check out the upcoming shenanigans here.", 
    link: '/events',
    isWorkInProgress: true,
  },
  { 
    title: 'sports predictions', 
    icon: 'sports_soccer', 
    description: "compete in friendly sports prediction leagues with friends and against prediction models.", 
    link: '/sports-predictions',
    isWorkInProgress: true,
  },
   { 
    title: 'sports predictions', 
    icon: 'sports_soccer', 
    description: "compete in friendly sports prediction leagues with friends and against prediction models.", 
    link: '/sports-predictions',
    isWorkInProgress: true,
  },
   { 
    title: 'sailing', 
    icon: 'sailing', 
    description: "a place to document my progress learning to sail, and my sailing adventures and experiences.", 
    link: '/sailing',
    isWorkInProgress: true,
  },
   { 
    title: 'movie reviews', 
    icon: 'theaters', 
    description: "a place to share my thoughts and opinions about films i've seen, particularly so-bad-they're good ones.", 
    link: '/movies',
    isWorkInProgress: true,
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
