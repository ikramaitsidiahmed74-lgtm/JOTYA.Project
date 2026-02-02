import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Fournisseur existing pages (do not modify these components)
import { Products } from './fornisseur/products/products';
import { Dashboard } from './fornisseur/dashboard/dashboard';
import { Sales } from './fornisseur/sales/sales';
import { Orders } from './fornisseur/orders/orders';
import { Messages } from './fornisseur/messages/messages';
import { Settings } from './fornisseur/settings/settings';
import { Connexion } from './fornisseur/connexion/connexion';

// New layout that wraps existing Fournisseur UI
import { FournisseurLayoutComponent } from './fournisseur/layout/fournisseur-layout.component';

// Admin area components (new)
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { AdminDashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { AdminUsersComponent } from './admin/pages/users/users.component';
import { AdminValidationComponent } from './admin/pages/validation/validation.component';
import { AdminCommandesComponent } from './admin/pages/commandes/commandes.component';
import { AdminRapportsComponent } from './admin/pages/rapports/rapports.component';
import { AdminParametresComponent } from './admin/pages/parametres/parametres.component';
import { AdminCentrAideComponent } from './admin/pages/centr-aide/centr-aide';
export const routes: Routes = [
  // root redirect to Fournisseur dashboard for compatibility
  { path: '', redirectTo: 'dashboard/fournisseur', pathMatch: 'full' },

  {
    path: 'dashboard',
    children: [
      {
        path: 'fournisseur',
        component: FournisseurLayoutComponent,
        children: [
          { path: '', component: Dashboard },
          { path: 'products', component: Products },
          { path: 'sales', component: Sales },
          { path: 'orders', component: Orders },
          { path: 'messages', component: Messages },
          { path: 'settings', component: Settings },
        ],
      },

      {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
          { path: '', component: AdminDashboardComponent },
          { path: 'users', component: AdminUsersComponent },
          { path: 'validation', component: AdminValidationComponent },
          { path: 'commandes', component: AdminCommandesComponent },
          { path: 'rapports', component: AdminRapportsComponent },
          { path: 'parametres', component: AdminParametresComponent },
          { path: 'centr-aide', component: AdminCentrAideComponent },
        ],
      },
    ],
  },

  // public routes
  { path: 'connexion', component: Connexion },

  // compatibility redirects for legacy Fournisseur sidebar links
  // The existing Fournisseur sidebar uses root-level links like '/products', '/sales', etc.
  // We keep those links working by redirecting them to the new layout-based paths.
  { path: 'products', redirectTo: 'dashboard/fournisseur/products' },
  { path: 'sales', redirectTo: 'dashboard/fournisseur/sales' },
  { path: 'orders', redirectTo: 'dashboard/fournisseur/orders' },
  { path: 'messages', redirectTo: 'dashboard/fournisseur/messages' },
  { path: 'settings', redirectTo: 'dashboard/fournisseur/settings' },

  // fallback
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}