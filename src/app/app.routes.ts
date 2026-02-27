import { Routes } from '@angular/router';
import { RenderMode } from '@angular/ssr';

export const routes: Routes = [
    {
        path: '', 
        loadChildren: () => import('./pages/home/home-module').then(m => m.HomeModule),
    },
    {
        path: 'admin', 
        loadChildren: () => import('./pages/admin/admin-module').then(m => m.AdminModule),
    },
    {
        path: 'profile', 
        loadChildren: () => import('./pages/profile/profile-module').then(m => m.ProfileModule),
    },
    {
        path: 'recipes', 
        loadChildren: () => import('./pages/recipes/recipes-module').then(m => m.RecipesModule),
    },
    {
        path: 'recipe/:id', 
        loadChildren: () => import('./pages/recipe/recipe-module').then(m => m.RecipeModule),
    },
];
