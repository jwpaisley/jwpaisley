import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'jwpaisley-action-dock',
  standalone: true,
  imports: [AsyncPipe, CommonModule, LayoutModule],
  templateUrl: './action-dock.html',
  styleUrl: './action-dock.scss'
})
export class ActionDock {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));
}