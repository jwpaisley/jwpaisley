import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../helpers/api-url';

export interface RecipeTag {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeTagService {
  private httpClient = inject(HttpClient);
  private readonly localApiUrl = 'http://localhost:8080/api/recipe-tags';
  private readonly prodApiUrl = 'https://api.jwpaisley.com/api/recipe-tags';
  private readonly apiUrl = getApiUrl(this.localApiUrl, this.prodApiUrl);

  getRecipeTags(): Observable<RecipeTag[]> {
    return this.httpClient.get<RecipeTag[]>(this.apiUrl);
  }

  getRecipeTag(recipeTagId: string): Observable<RecipeTag> {
    return this.httpClient.get<RecipeTag>(`${this.apiUrl}/${recipeTagId}`);
  }

  createRecipeTag(recipeTag: RecipeTag): Observable<RecipeTag> {
    return this.httpClient.post<RecipeTag>(this.apiUrl, recipeTag);
  }

  updateRecipeTag(recipeTag: RecipeTag): Observable<RecipeTag> {
    return this.httpClient.put<RecipeTag>(`${this.apiUrl}/${recipeTag.id}`, recipeTag);
  }

  deleteRecipeTag(recipeTagId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${recipeTagId}`);
  }
}
