import { Routes } from '@angular/router';
import { AdminPageGuard } from './guards/admin-page-guard';

export const routes: Routes = [
    {
        path: '', 
        loadChildren: () => import('./pages/home/home-module').then(m => m.HomeModule),
    },
    {
        path: 'admin', 
        loadChildren: () => import('./pages/admin/admin-module').then(m => m.AdminModule),
        canActivate: [AdminPageGuard],
    },
    {
        path: 'profile', 
        loadChildren: () => import('./pages/profile/profile-module').then(m => m.ProfileModule),
    },
    {
        path: 'library', 
        loadChildren: () => import('./pages/books/books-module').then(m => m.BooksModule),
    },
    {
        path: 'recipes', 
        loadChildren: () => import('./pages/recipes/recipes-module').then(m => m.RecipesModule),
    },
    {
        path: 'recipe/:id', 
        loadChildren: () => import('./pages/recipe/recipe-module').then(m => m.RecipeModule),
    },
    {
        path: 'euchre', 
        loadChildren: () => import('./pages/euchre/euchre-module').then(m => m.EuchreModule),
    }
];
