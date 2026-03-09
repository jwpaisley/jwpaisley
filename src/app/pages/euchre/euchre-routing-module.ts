import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Euchre } from './euchre';

const routes: Routes = [
  {
    path: '', component: Euchre,
  },
  { 
    path: ':id', component: Euchre 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EuchreRoutingModule { }
