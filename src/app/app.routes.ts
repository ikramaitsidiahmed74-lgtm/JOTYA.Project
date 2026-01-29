import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route - redirect to home
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  // Home route with lazy loading
  {
    path: 'home',
    pathMatch: 'full',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },

  // Guide route with lazy loading
  {
    path: 'guide',
    loadComponent: () => import('./guide/guide').then((m) => m.Guide),
  },

  // Cart route with lazy loading
  {
    path: 'cart',
    loadComponent: () => import('./panier/panier').then((m) => m.Panier),
  },

  // Help/Aide route with lazy loading
  {
    path: 'aide',
    loadComponent: () => import('./aide/aide').then((m) => m.Aide),
  },

  // Checkout route with lazy loading
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout').then((m) => m.CheckoutComponent),
  },

  // Auth routes with lazy loading
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/client-login/client-login').then((m) => m.ClientLoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/client-register/client-register').then((m) => m.ClientRegisterComponent),
      },
      {
        path: 'vendeur-login',
        loadComponent: () => import('./auth/vendeur-login/vendeur-login').then((m) => m.VendeurLoginComponent),
      },
      {
        path: 'vendeur-register',
        loadComponent: () => import('./auth/vendeur-register/vendeur-register').then((m) => m.VendeurRegisterComponent),
      },
      {
        path: 'vendeur-profil',
        loadComponent: () => import('./auth/vendeur-profil/vendeur-profil').then((m) => m.VendeurProfilComponent),
      },
      {
        path: 'vendeur-boutique',
        loadComponent: () => import('./auth/vendeur-boutique/vendeur-boutique').then((m) => m.VendeurBoutiqueComponent),
      },
      {
        path: 'vendeur-certification',
        loadComponent: () => import('./auth/vendeur-certification/vendeur-certification').then((m) => m.VendeurCertificationComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // Wildcard route - redirect unknown routes to home
  { path: '**', redirectTo: 'home' },
];
