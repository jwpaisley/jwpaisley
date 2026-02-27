import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UUID } from 'crypto';

export declare interface Recipe {
  id: string;
  name: string;
  emoji: string;
  description: string;

  servings: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;

  recipeCategories: string[];
  ingredients: string[];
  miseEnPlaceSteps: string[];
  instructions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api/recipes';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api/recipes';
  private readonly apiUrl = this.prodApiUrl;

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.httpClient.post<Recipe>(`${this.apiUrl}`, recipe);
  }

  getRecipes(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(`${this.apiUrl}`);
  }

  getRecipe(recipeId: string): Observable<Recipe> {
    return this.httpClient.get<Recipe>(`${this.apiUrl}/${recipeId}`);
  }

  // updateRecipe(recipe: Recipe): Observable<Recipe> {
  //   return this.httpClient.put<Recipe>(`${this.apiUrl}/${recipe.id}`, recipe);
  // }

  // deleteRecipe(recipeId: string): Observable<void> {
  //   return this.httpClient.delete<void>(`${this.apiUrl}/${recipeId}`);
  // }
}
