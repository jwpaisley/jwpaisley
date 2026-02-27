import { Component, Input, OnInit } from '@angular/core';
import { Recipe, RecipeService } from '../../services/recipe-service/recipe-service';
import { first } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Loader } from '../../components/loader/loader';

@Component({
  selector: 'jwpaisley-recipes',
  imports: [RouterLink, Loader],
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
