import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  // Public routes
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'guide', loadComponent: () => import('./guide/guide').then(m => m.Guide) },
  { path: 'cart', loadComponent: () => import('./panier/panier').then(m => m.Panier) },
  { path: 'aide', loadComponent: () => import('./aide/aide').then(m => m.Aide) },
  { path: 'checkout', loadComponent: () => import('./checkout/checkout').then(m => m.CheckoutComponent) },

  // Auth routes
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout.component').then(m => m.AuthLayoutComponent),
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

  // Fournisseur/Admin area
  {
    path: 'dashboard',
    children: [
      {
        path: 'fournisseur',
        loadComponent: () => import('./fornisseur/fournisseur-layout.component').then(m => m.FournisseurLayoutComponent),
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
          { path: 'dashboard', loadComponent: () => import('./fornisseur/dashboard/dashboard').then(m => m.Dashboard) },
          { path: 'ajouter-produit', loadComponent: () => import('./fornisseur/add-product/add-product').then(m => m.AddProductComponent) },
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
          { path: '', loadComponent: () => import('./admin/pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent), data: { title: "Vue d'ensemble" } },
          { path: 'users', loadComponent: () => import('./admin/pages/users/users.component').then(m => m.AdminUsersComponent), data: { title: 'Utilisateurs' } },
          { path: 'validation', loadComponent: () => import('./admin/pages/validation/validation.component').then(m => m.AdminValidationComponent), data: { title: 'Validation Produits' } },
          { path: 'commandes', loadComponent: () => import('./admin/pages/commandes/commandes.component').then(m => m.AdminCommandesComponent), data: { title: 'Commandes Globales' } },
          { path: 'rapports', loadComponent: () => import('./admin/pages/rapports/rapports.component').then(m => m.AdminRapportsComponent), data: { title: 'Rapports' } },
          { path: 'parametres', loadComponent: () => import('./admin/pages/parametres/parametres.component').then(m => m.AdminParametresComponent), data: { title: 'Paramètres' } },
          { path: 'centr-aide', loadComponent: () => import('./admin/pages/centr-aide/centr-aide').then(m => m.AdminCentrAideComponent), data: { title: "Centre d’aide" } },
        ]
      }
    ]
  },

  // Backwards compatibility redirects
  { path: 'products', redirectTo: 'dashboard/fournisseur/products' },
  { path: 'sales', redirectTo: 'dashboard/fournisseur/sales' },
  { path: 'orders', redirectTo: 'dashboard/fournisseur/orders' },
  { path: 'messages', redirectTo: 'dashboard/fournisseur/messages' },
  { path: 'settings', redirectTo: 'dashboard/fournisseur/settings' },
  { path: 'products', redirectTo: 'dashboard/fournisseur/products' },

  // Connexion public
  { path: 'connexion', loadComponent: () => import('./fornisseur/connexion/connexion').then(m => m.Connexion) },

  // Catalogue / product detail routes
  { path: 'catalogue-luxe', component: CatalogueLuxeComponent },
  { path: 'catalogue-luxe/:category', component: CatalogueLuxeComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'categories/vetements', component: VetementsCategoryComponent },
  { path: 'categories/vetement', component: VetementComponent },
  { path: 'categories/accessoires', component: AccessoiresCategoryComponent },
  { path: 'categories/pieces-uniques', component: PiecesUniquesComponent },
  { path: 'categories/maison', component: MaisonCategoryComponent },
  { path: 'categories/electronique', component: ElectroniqueCategoryComponent },
  { path: 'categories/marques', component: MarquesCategoryComponent },
  { path: 'categories/velo', component: VeloCategoryComponent },
  { path: 'categories/construction', component: ConstructionCategoryComponent },

  // Fallback
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
