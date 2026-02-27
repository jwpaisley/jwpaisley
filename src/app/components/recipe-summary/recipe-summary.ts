import { Component, Input, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Recipe } from '../../services/recipe-service/recipe-service';

@Component({
  selector: 'jwpaisley-recipe-summary',
  standalone: true,
  imports: [AsyncPipe, LayoutModule],
  templateUrl: './recipe-summary.html',
  styleUrls: ['./recipe-summary.scss']
})
export class RecipeSummary {
  @Input({ required: true }) recipe!: Recipe;
  private breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));
}