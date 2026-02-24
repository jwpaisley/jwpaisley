import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export declare interface Recipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  recipeCategories: string[];
  miseEnPlaceSteps: string[];
  preparationSteps: string[];
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private httpClient = inject(HttpClient);
  private readonly apiUrl = 'https://api.example.com/recipes';

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.httpClient.post<Recipe>(this.apiUrl, recipe);
  }

  getRecipes(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(`${this.apiUrl}/all`);
  }

  getRecipe(recipeId: string): Observable<Recipe> {
    return this.httpClient.get<Recipe>(`${this.apiUrl}/${recipeId}`);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.httpClient.put<Recipe>(`${this.apiUrl}/${recipe.id}`, recipe);
  }

  deleteRecipe(recipeId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${recipeId}`);
  }
}
