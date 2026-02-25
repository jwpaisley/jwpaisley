import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadChildren: () => import('./pages/home/home-module').then(m => m.HomeModule),
    },
    {
        path: 'profile', loadChildren: () => import('./pages/profile/profile-module').then(m => m.ProfileModule),
    },
    {
        path: 'recipes', loadChildren: () => import('./pages/recipes/recipes-module').then(m => m.RecipesModule),
    },
];
