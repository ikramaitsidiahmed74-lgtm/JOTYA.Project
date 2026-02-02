<<<<<<< HEAD
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Public (user-facing) routes - lazy loaded where components are standalone
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  { path: 'home', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'guide', loadComponent: () => import('./guide/guide').then((m) => m.Guide) },
  { path: 'cart', loadComponent: () => import('./panier/panier').then((m) => m.Panier) },
  { path: 'aide', loadComponent: () => import('./aide/aide').then((m) => m.Aide) },
  { path: 'checkout', loadComponent: () => import('./checkout/checkout').then((m) => m.CheckoutComponent) },

  // Auth routes (uses auth layout + child routes)
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      { path: 'login', loadComponent: () => import('./auth/client-login/client-login').then(m => m.ClientLoginComponent) },
      { path: 'register', loadComponent: () => import('./auth/client-register/client-register').then(m => m.ClientRegisterComponent) },
      { path: 'vendeur-login', loadComponent: () => import('./auth/vendeur-login/vendeur-login').then(m => m.VendeurLoginComponent) },
      { path: 'vendeur-register', loadComponent: () => import('./auth/vendeur-register/vendeur-register').then(m => m.VendeurRegisterComponent) },
      { path: 'vendeur-profil', loadComponent: () => import('./auth/vendeur-profil/vendeur-profil').then(m => m.VendeurProfilComponent) },
      { path: 'vendeur-boutique', loadComponent: () => import('./auth/vendeur-boutique/vendeur-boutique').then(m => m.VendeurBoutiqueComponent) },
      { path: 'vendeur-certification', loadComponent: () => import('./auth/vendeur-certification/vendeur-certification').then(m => m.VendeurCertificationComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },

  // Fournisseur/Admin area - use existing components (kept as explicit imports in the module)
  {
    path: 'dashboard',
    children: [
      {
        path: 'fournisseur',
        loadComponent: () => import('./fornisseur/fournisseur-layout.component').then(m => m.FournisseurLayoutComponent),
        children: [
          { path: '', loadComponent: () => import('./fornisseur/dashboard/dashboard').then(m => m.Dashboard) },
          { path: 'products', loadComponent: () => import('./fornisseur/products/products').then(m => m.Products) },
          { path: 'sales', loadComponent: () => import('./fornisseur/sales/sales').then(m => m.Sales) },
          { path: 'orders', loadComponent: () => import('./fornisseur/orders/orders').then(m => m.Orders) },
          { path: 'messages', loadComponent: () => import('./fornisseur/messages/messages').then(m => m.Messages) },
          { path: 'settings', loadComponent: () => import('./fornisseur/settings/settings').then(m => m.Settings) },
        ]
      },
      {
        path: 'admin',
        loadComponent: () => import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
          { path: '', loadComponent: () => import('./admin/pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
          { path: 'users', loadComponent: () => import('./admin/pages/users/users.component').then(m => m.AdminUsersComponent) },
          { path: 'validation', loadComponent: () => import('./admin/pages/validation/validation.component').then(m => m.AdminValidationComponent) },
          { path: 'commandes', loadComponent: () => import('./admin/pages/commandes/commandes.component').then(m => m.AdminCommandesComponent) },
          { path: 'rapports', loadComponent: () => import('./admin/pages/rapports/rapports.component').then(m => m.AdminRapportsComponent) },
          { path: 'parametres', loadComponent: () => import('./admin/pages/parametres/parametres.component').then(m => m.AdminParametresComponent) },
          { path: 'centr-aide', loadComponent: () => import('./admin/pages/centr-aide/centr-aide').then(m => m.AdminCentrAideComponent) },
        ]
      }
    ]
  },

  // Backwards compatibility: root-level redirects used by legacy UI
  { path: 'products', redirectTo: 'dashboard/fournisseur/products' },
  { path: 'sales', redirectTo: 'dashboard/fournisseur/sales' },
  { path: 'orders', redirectTo: 'dashboard/fournisseur/orders' },
  { path: 'messages', redirectTo: 'dashboard/fournisseur/messages' },
  { path: 'settings', redirectTo: 'dashboard/fournisseur/settings' },

  // Connexion (public)
  { path: 'connexion', loadComponent: () => import('./fornisseur/connexion/connexion').then(m => m.Connexion) },

  // Fallback → go to Home
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

=======
import { Routes } from '@angular/router';
import { CatalogueLuxeComponent } from './catalogue-luxe/catalogue-luxe.component';
import { VetementsCategoryComponent } from './components/categories/vetements/vetements-category.component';
import { VetementComponent } from './components/categories/vetement/vetement.component';
import { AccessoiresCategoryComponent } from './components/categories/accessoires/accessoires-category.component';
import { PiecesUniquesComponent } from './components/categories/pieces-uniques/pieces-uniques-category.component';
import { MaisonCategoryComponent } from './components/categories/maison/maison-category.component';
import { ElectroniqueCategoryComponent } from './components/categories/electronique/electronique-category.component';
import { MarquesCategoryComponent } from './components/categories/marques/marques-category.component';
import { VeloCategoryComponent } from './components/categories/velo/velo-category.component';
import { ConstructionCategoryComponent } from './components/categories/construction/construction-category.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalogue-luxe',
    pathMatch: 'full',
  },
  // Route catalogue sans catégorie (affiche tous les produits)
  {
    path: 'catalogue-luxe',
    component: CatalogueLuxeComponent,
  },
  // Route catalogue avec catégorie (filtre par catégorie)
  {
    path: 'catalogue-luxe/:category',
    component: CatalogueLuxeComponent,
  },
  // Route détail produit - NOUVELLE
  {
    path: 'products/:id',
    component: ProductDetailComponent,
  },
  // Routes pour les composants de catégories individuelles
  {
    path: 'categories/vetements',
    component: VetementsCategoryComponent,
  },
  {
    path: 'categories/vetement',
    component: VetementComponent,
  },
  {
    path: 'categories/accessoires',
    component: AccessoiresCategoryComponent,
  },
  {
    path: 'categories/pieces-uniques',
    component: PiecesUniquesComponent,
  },
  {
    path: 'categories/maison',
    component: MaisonCategoryComponent,
  },
  {
    path: 'categories/electronique',
    component: ElectroniqueCategoryComponent,
  },
  {
    path: 'categories/marques',
    component: MarquesCategoryComponent,
  },
  {
    path: 'categories/velo',
    component: VeloCategoryComponent,
  },
  {
    path: 'categories/construction',
    component: ConstructionCategoryComponent,
  },
];
>>>>>>> 54df383e3ef65b799c443c20681ae3009b6b758c
