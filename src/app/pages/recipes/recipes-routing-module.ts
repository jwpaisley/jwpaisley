import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Recipes } from './recipes';

const routes: Routes = [
    {
      path: '', component: Recipes
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
