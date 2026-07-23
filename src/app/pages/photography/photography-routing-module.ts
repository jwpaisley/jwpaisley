// photography-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Timeline } from '../../components/photography/timeline/timeline';
import { Collections } from '../../components/photography/collections/collections';
import { CollectionDetails } from '../../components/photography/collection-details/collection-details';
import { PhotographyPage } from './photography';

const routes: Routes = [
  {
    path: '',
    component: PhotographyPage,
    children: [
        {
            path: '',
            redirectTo: 'timeline',
            pathMatch: 'full'
        },
        {
            path: 'timeline',
            component: Timeline,
        },
        {
            path: 'collections',
            component: Collections
        },
        {
            path: 'collections/:id',
            component: CollectionDetails
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotographyRoutingModule { }