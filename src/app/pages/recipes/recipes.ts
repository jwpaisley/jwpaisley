import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Recipe, RecipePage, RecipeService } from '../../services/recipe-service/recipe-service';
import { Subject, takeUntil } from 'rxjs';
import { Loader } from '../../components/loader/loader';
import { RecipesTable } from '../../components/recipes-table/recipes-table';
import { UserService } from '../../services/user-service/user-service';
import { Button } from '../../components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'jwpaisley-recipes',
  imports: [Loader, RecipesTable, Button],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit, OnDestroy {
  protected isLoading = true;
  protected isUserAdmin = false;
  protected recipes: Recipe[] = [];
  protected hasMoreRecipes = false;
  protected nextPageToken: string | null = null;
  protected destroy$ = new Subject<void>();
  private router = inject(Router);

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  private loadRecipes(pageToken?: string): void {
    this.isLoading = true;

    this.recipeService.getRecipes(pageToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page: RecipePage) => {
          this.recipes = pageToken ? [...this.recipes, ...page.items] : page.items;
          this.nextPageToken = page.nextPageToken;
          this.hasMoreRecipes = !!page.nextPageToken;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  protected loadMoreRecipes(): void {
    if (!this.hasMoreRecipes || !this.nextPageToken) {
      return;
    }

    this.loadRecipes(this.nextPageToken);
  }

  ngOnInit() {
    this.loadRecipes();

    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isUserAdmin = this.userService.isUserAdmin();
        this.cdr.detectChanges();
      });
  }
    
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected redirectToCreateRecipePage(): void {
    this.router.navigate(['/recipe/new']);
  }
}
