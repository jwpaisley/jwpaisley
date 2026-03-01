import { Component, inject, Input, OnInit } from '@angular/core';
import { RecipeService, Recipe } from '../../services/recipe-service/recipe-service';
import { first } from 'rxjs/internal/operators/first';
import { RecipeSummary } from '../../components/recipe-summary/recipe-summary';
import { Loader } from '../../components/loader/loader';
import { RecipeDetails } from '../../components/recipe-details/recipe-details';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

const STARTER_RECIPE: Recipe = {
  id: '',
  name: '',
  emoji: '',
  description: '',

  servings: 0,
  calories: 0,
  protein: 0,
  fat: 0,
  carbohydrates: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,

  recipeCategories: [],
  ingredients: [],
  miseEnPlaceSteps: [],
  instructions: [],

  createdAt: new Date(),
  updatedAt: new Date(),
};

@Component({
  selector: 'jwpaisley-recipe',
  imports: [Loader, RecipeSummary, RecipeDetails, ReactiveFormsModule],
  templateUrl: './recipe.html',
  styleUrl: './recipe.scss',
})
export class RecipePage implements OnInit {
  @Input({required: true}) id!: string;
  private formBuilder = inject(FormBuilder);
  protected isLoading = true;
  protected recipe!: Recipe;
  protected formGroup: FormGroup = this.buildFormGroup();
 
  constructor(private recipeService: RecipeService) {}

  buildFormGroup() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      emoji: ['🍲', Validators.required],

      calories: [0, [Validators.required, Validators.min(0)]],
      protein: [0, [Validators.required, Validators.min(0)]],
      fat: [0, [Validators.required, Validators.min(0)]],
      carbs: [0, [Validators.required, Validators.min(0)]],
      fiber: [0, [Validators.required, Validators.min(0)]],
      sugar: [0, [Validators.required, Validators.min(0)]],
      sodium: [0, [Validators.required, Validators.min(0)]],

      ingredients: this.formBuilder.array([this.formBuilder.control('')]),
      miseEnPlaceSteps: this.formBuilder.array([this.formBuilder.control('')]),
      instructions: this.formBuilder.array([this.formBuilder.control('')]),
    });
  }

  ngOnInit(): void {
    if (this.id === 'new') {
      this.isLoading = false;
      this.recipe = STARTER_RECIPE;
      return;
    } else {
      this.recipeService.getRecipe(this.id)
        .pipe(first())
        .subscribe((recipe: Recipe) => {
          this.recipe = recipe;
          this.isLoading = false;
        });
    }
  }
}
