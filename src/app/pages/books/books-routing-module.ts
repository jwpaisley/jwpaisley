// book-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksPage } from './books';
import { Reading } from '../../components/books/reading/reading';
import { WantToRead } from '../../components/books/want-to-read/want-to-read';
import { Timeline } from '../../components/books/timeline/timeline';

const routes: Routes = [
  {
    path: '',
    component: BooksPage,
    children: [
      {
        path: '',
        redirectTo: 'reading',
        pathMatch: 'full'
      },
      {
        path: 'reading',
        component: Reading,
      },
      {
        path: 'want-to-read',
        component: WantToRead,
      },
      {
        path: 'timeline',
        component: Timeline,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }