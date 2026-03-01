import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Recipe, RecipeService } from '../../services/recipe-service/recipe-service';
import { first, Subject, takeUntil } from 'rxjs';
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
  protected destroy$ = new Subject<void>();
  private router = inject(Router);

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.recipeService.getRecipes()
      .pipe(first())
      .subscribe((recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      });

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
