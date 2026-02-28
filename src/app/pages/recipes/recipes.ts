import { Component, Input, OnInit } from '@angular/core';
import { Recipe, RecipeService } from '../../services/recipe-service/recipe-service';
import { first } from 'rxjs';
import { Loader } from '../../components/loader/loader';
import { RecipesTable } from '../../components/recipes-table/recipes-table';

@Component({
  selector: 'jwpaisley-recipes',
  imports: [Loader, RecipesTable],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  protected isLoading = true;
  protected recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService.getRecipes()
      .pipe(first())
      .subscribe((recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      });
  }
}
