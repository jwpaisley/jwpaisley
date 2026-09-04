import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sailing } from './sailing';
import { Conditions } from '../../components/sailing/conditions/conditions';
import { Boats } from '../../components/sailing/boats/boats';
import { BoatDetails } from '../../components/sailing/boat-details/boat-details';
import { Voyages } from '../../components/sailing/voyages/voyages';
import { Posts } from '../../components/sailing/posts/posts';

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
        path: 'boats/:id',
        component: BoatDetails,
      },
      {
        path: 'voyages',
        component: Voyages,
      },
      {
        path: 'posts',
        component: Posts,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SailingRoutingModule {}
