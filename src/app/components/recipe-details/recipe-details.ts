import { Component, Input } from '@angular/core';
import { Recipe } from '../../services/recipe-service/recipe-service';
import { FormList } from '../form-list/form-list';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'jwpaisley-recipe-details',
  standalone: true,
  imports: [FormList, ReactiveFormsModule],
  templateUrl: './recipe-details.html',
  styleUrls: ['./recipe-details.scss']
})
export class RecipeDetails {
  @Input({ required: true }) recipe!: Recipe;
  @Input() editMode = false;
  @Input() formGroup!: FormGroup;
}