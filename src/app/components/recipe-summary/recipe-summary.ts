import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Recipe } from '../../services/recipe-service/recipe-service';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormTextArea } from '../form-text-area/form-text-area';
import { timestampToDateString } from '../../helpers/date-helper';

@Component({
  selector: 'jwpaisley-recipe-summary',
  standalone: true,
  imports: [AsyncPipe, LayoutModule, Button, FormInput, FormTextArea, ReactiveFormsModule],
  templateUrl: './recipe-summary.html',
  styleUrls: ['./recipe-summary.scss']
})
export class RecipeSummary {
  @Input({ required: true }) recipe!: Recipe;
  @Input() editMode = false;
  @Input() isUserAdmin = false;
  @Input() isNewRecipe = false;
  @Input() formGroup!: FormGroup;
  @Output() editButtonClicked = new EventEmitter<void>();
  @Output() changeEmojiButtonClicked = new EventEmitter<void>();
  @Output() saveButtonClicked = new EventEmitter<void>();
  @Output() cancelButtonClicked = new EventEmitter<void>();
  @Output() deleteButtonClicked = new EventEmitter<void>();

  protected get formEmoji(): string {
    return this.formGroup.get('emoji')?.value || '🍲';
  }

  private breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));
}