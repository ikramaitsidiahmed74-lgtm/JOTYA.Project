import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route - only headers visible, no component loaded
  // Cart component will only be displayed when user clicks cart icon (same as Aide component)
  // This is the same behavior as Aide component - not auto-displayed on page load
  // Default route redirects to home to prevent routing errors
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  // Home route - only headers visible, no component loaded
  {
    path: 'home',
    pathMatch: 'full',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },

  {
    path: 'cart',
    loadComponent: () => import('./panier/panier').then((m) => m.Panier),
  },
  {
    path: 'aide',
    loadComponent: () => import('./aide/aide').then((m) => m.Aide),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout').then((m) => m.CheckoutComponent),
  },
  // Wildcard route - redirect unknown routes to home (prevents 404 issues)
  { path: '**', redirectTo: 'home' },
];
