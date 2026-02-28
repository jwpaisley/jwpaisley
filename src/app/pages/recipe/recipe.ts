import { Component, Input, OnInit } from '@angular/core';
import { RecipeService, Recipe } from '../../services/recipe-service/recipe-service';
import { first } from 'rxjs/internal/operators/first';
import { RecipeSummary } from '../../components/recipe-summary/recipe-summary';
import { Loader } from '../../components/loader/loader';
import { RecipeDetails } from '../../components/recipe-details/recipe-details';

@Component({
  selector: 'jwpaisley-recipe',
  imports: [Loader, RecipeSummary, RecipeDetails],
  templateUrl: './recipe.html',
  styleUrl: './recipe.scss',
})
export class RecipePage implements OnInit {
  @Input({required: true}) id!: string;

  protected isLoading = true;
  protected recipe!: Recipe;
 
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getRecipe(this.id)
      .pipe(first())
      .subscribe((recipe: Recipe) => {
        this.recipe = recipe;
        this.isLoading = false;
      });
  }
}
