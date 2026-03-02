import { Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RecipeService, Recipe } from '../../services/recipe-service/recipe-service';
import { first } from 'rxjs/internal/operators/first';
import { RecipeSummary } from '../../components/recipe-summary/recipe-summary';
import { Loader } from '../../components/loader/loader';
import { RecipeDetails } from '../../components/recipe-details/recipe-details';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../services/user-service/user-service';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { DialogService } from '../../services/dialog-service/dialog-service';

const RECIPE_TEMPLATE: Recipe = {
  id: '',
  name: '',
  emoji: '🍲',
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
  private platformId = inject(PLATFORM_ID);
  private formBuilder = inject(FormBuilder);
  protected isLoading = true;
  protected editMode = false;
  protected isBrowser = isPlatformBrowser(this.platformId);
  protected isUserAdmin = signal(false);
  protected recipe: Recipe = RECIPE_TEMPLATE;
  protected formGroup: FormGroup = this.buildFormGroup(RECIPE_TEMPLATE);
  private destroy$ = new Subject<void>();
  
  constructor(
    private dialogService: DialogService,
    private recipeService: RecipeService,
    private userService: UserService,
  ) {}

  buildFormGroup(recipe: Recipe): FormGroup {
    return this.formBuilder.group({
      name: [recipe.name, [Validators.required, Validators.minLength(1)]],
      emoji: [recipe.emoji, [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      description: [recipe.description, Validators.required],

      servings: [recipe.servings, [Validators.required, Validators.min(0)]],
      calories: [recipe.calories, [Validators.required, Validators.min(0)]],
      protein: [recipe.protein, [Validators.required, Validators.min(0)]],
      fat: [recipe.fat, [Validators.required, Validators.min(0)]],
      carbohydrates: [recipe.carbohydrates, [Validators.required, Validators.min(0)]],
      fiber: [recipe.fiber, [Validators.required, Validators.min(0)]],
      sugar: [recipe.sugar, [Validators.required, Validators.min(0)]],
      sodium: [recipe.sodium, [Validators.required, Validators.min(0)]],

      ingredients: this.formBuilder.array(
        recipe.ingredients.map(ingredient => 
          this.formBuilder.control(ingredient, Validators.required)
        )
      ),
      miseEnPlaceSteps: this.formBuilder.array(
        recipe.miseEnPlaceSteps.map(step => this.formBuilder.control(step, Validators.required))
      ),
      instructions: this.formBuilder.array(
        recipe.instructions.map(step => this.formBuilder.control(step, Validators.required))
      )
    });
  }

  ngOnInit(): void {
    if (this.isNewRecipe) {
      this.editMode = true;
      this.isLoading = false;
    } else {
      this.recipeService.getRecipe(this.id)
        .pipe(first())
        .subscribe((recipe: Recipe) => {
          this.recipe = recipe;
          this.syncForm(this.recipe);
          this.isLoading = false;
        });
    }

    if (this.isBrowser) {
      this.userService.user$
        .pipe(takeUntil(this.destroy$))
        .subscribe(user => {
          this.isUserAdmin.set(this.userService.isUserAdmin());
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected enterEditMode = () => {
    this.editMode = true;
  };

  async saveRecipe(): Promise<void> {
    console.log(this.formGroup?.value);
    const result = await this.dialogService.openConfirmDialog({
      title: 'save recipe',
      text: 'are you sure you want to save this recipe?',
      confirmLabel: 'save',
      cancelLabel: 'cancel',
    });

    if (result.confirmed) {
      this.editMode = false;
      this.isLoading = true;
      
      const recipeToSave = this.recipeFromForm();
      console.log('Saving recipe:', recipeToSave);

      if (this.isNewRecipe) {
        this.recipeService.createRecipe(recipeToSave)
          .subscribe((savedRecipe: Recipe) => {
            this.recipe = savedRecipe;
            this.syncForm(this.recipe);
            this.isLoading = false;
          });
      } else {
        // TODO: update existing recipe
      }
    }
  }

  cancelEdit(): void {
    this.syncForm(this.recipe);
    this.editMode = false;
  }

  openEmojiPicker(): void {

  }

  deleteRecipe(): void {}

  get isNewRecipe(): boolean {
    return this.id === 'new';
  }

  private syncForm(recipe: Recipe) {
    this.formGroup.reset(recipe);
    this.syncFormArray('ingredients', recipe.ingredients);
    this.syncFormArray('miseEnPlaceSteps', recipe.miseEnPlaceSteps);
    this.syncFormArray('instructions', recipe.instructions);
  }

  private syncFormArray(controlName: string, data: any[]) {
    const formArray = this.formGroup.get(controlName) as FormArray;
    formArray.clear();
    data.forEach(item => {
      formArray.push(this.formBuilder.control(item, Validators.required));
    });
  }

  private recipeFromForm(): Recipe {
    const formValue = this.formGroup.value;
    return {
      ...this.recipe,
      ...formValue,
      ingredients: this.getFormArrayValues('ingredients'),
      miseEnPlaceSteps: this.getFormArrayValues('miseEnPlaceSteps'),
      instructions: this.getFormArrayValues('instructions'),
    };
  }

  private getFormArrayValues(controlName: string): any[] {
    const formArray = this.formGroup.get(controlName) as FormArray;
    return formArray.controls.map(control => control.value);
  }
}
