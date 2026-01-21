import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { DashboardCard } from '../../components/dashboard-card/dashboard-card';

const NG_COMPONENT_IMPORTS = [
  CommonModule, 
  DashboardCard,
]

const GREETINGS = [
  "welcome to Paisley's whimsy den.",
  "Goose says hello 🐶"
]

@Component({
  selector: 'app-home',
  imports: NG_COMPONENT_IMPORTS,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private breakpointObserver = inject(BreakpointObserver);

  // Column count changes based on screen size
  columns$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(({ matches }) => {
        if (this.breakpointObserver.isMatched(Breakpoints.Handset)) return 1;
        if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) return 2;
        return 3;
      })
    );

  greeting: string = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}
