import { Component, Input } from '@angular/core';
import { Recipe } from '../../services/recipe-service/recipe-service';

@Component({
  selector: 'jwpaisley-recipe-details',
  standalone: true,
  imports: [],
  templateUrl: './recipe-details.html',
  styleUrls: ['./recipe-details.scss']
})
export class RecipeDetails {
  @Input({ required: true }) recipe!: Recipe;
}