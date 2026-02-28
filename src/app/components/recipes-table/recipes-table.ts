import { Component, computed, inject, input } from '@angular/core';
import { Recipe } from '../../services/recipe-service/recipe-service';
import { Table, TableCellType, TableRow } from '../table/table';
import { Router } from '@angular/router';

@Component({
  selector: 'jwpaisley-recipes-table',
  imports: [Table],
  templateUrl: './recipes-table.html',
  styleUrl: './recipes-table.scss',
})
export class RecipesTable {
  private router = inject(Router);
  
  recipes = input.required<Recipe[]>();

  protected tableHeaders: string[] = [
    'name', 
    '',
  ];

  protected tableRows = computed<TableRow[]>(() => this.recipes().map((recipe): TableRow => ({
      cells: [
        { type: TableCellType.TEXT, data: recipe.name },
        { type: TableCellType.BUTTON, data: 'view', action: () => this.viewRecipe(recipe.id) },
      ]
    }
  )));

  protected mobileColumns = [0, 1];

  viewRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }
}
