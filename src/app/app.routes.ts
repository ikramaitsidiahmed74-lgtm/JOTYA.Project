import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { Dashboard } from './pages/dashboard/dashboard';
import { Sales } from './pages/sales/sales';
import { Orders } from './pages/orders/orders';
import { Messages } from './pages/messages/messages';
import { Settings } from './pages/settings/settings';
import { Connexion } from './pages/connexion/connexion';
export const routes: Routes = [
 { path: '', component: Dashboard },
  { path: 'products', component: Products },
  { path: 'sales', component: Sales },
  { path: 'orders', component: Orders },
  { path: 'messages', component: Messages},
  { path: 'settings', component: Settings },
  { path: 'connexion', component: Connexion },
   { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
