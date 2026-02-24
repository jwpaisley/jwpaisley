import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'recipes', loadChildren: () => import('./pages/recipes/recipes-module').then(m => m.RecipesModule),
    },
    {
        path: '', loadChildren: () => import('./pages/home/home-module').then(m => m.HomeModule),
    }
];
