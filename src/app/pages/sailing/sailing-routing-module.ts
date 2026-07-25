import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sailing } from './sailing';
import { Conditions } from '../../components/sailing/conditions/conditions';
import { Boats } from '../../components/sailing/boats/boats';
import { Voyages } from '../../components/sailing/voyages/voyages';

const routes: Routes = [
  {
    path: '',
    component: Sailing,
    children: [
      {
        path: '',
        redirectTo: 'conditions',
        pathMatch: 'full',
      },
      {
        path: 'conditions',
        component: Conditions,
      },
      {
        path: 'boats',
        component: Boats,
      },
      {
        path: 'voyages',
        component: Voyages,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SailingRoutingModule {}
