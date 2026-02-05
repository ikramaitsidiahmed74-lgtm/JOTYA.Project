import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic routes - render on client side
  {
    path: 'catalogue-luxe/:category',
    renderMode: RenderMode.Client
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client
  },
  // Static routes - prerender
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
