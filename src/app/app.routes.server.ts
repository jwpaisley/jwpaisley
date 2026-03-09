import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'recipe/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'euchre/:id',
    renderMode: RenderMode.Server,
  }
];
