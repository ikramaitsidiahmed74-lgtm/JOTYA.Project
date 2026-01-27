import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AuthLayoutComponent } from './layouts/auth-layout.component';

import { ClientLoginComponent } from './auth/client-login/client-login';
import { ClientRegisterComponent } from './auth/client-register/client-register';

import { VendeurLoginComponent } from './auth/vendeur-login/vendeur-login';
import { VendeurRegisterComponent } from './auth/vendeur-register/vendeur-register';
import { VendeurProfilComponent } from './auth/vendeur-profil/vendeur-profil';
import { VendeurBoutiqueComponent } from './auth/vendeur-boutique/vendeur-boutique';
import { VendeurCertificationComponent } from './auth/vendeur-certification/vendeur-certification';

import { Guide } from './guide/guide';

export const routes: Routes = [
  { path: '', component: Home },

  // ✅ GUIDE PAGE
  { path: 'guide', component: Guide },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: ClientLoginComponent },
      { path: 'register', component: ClientRegisterComponent },

      { path: 'vendeur-login', component: VendeurLoginComponent },
      { path: 'vendeur-register', component: VendeurRegisterComponent },
      { path: 'vendeur-profil', component: VendeurProfilComponent },
      { path: 'vendeur-boutique', component: VendeurBoutiqueComponent },
      { path: 'vendeur-certification', component: VendeurCertificationComponent },

      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' },
];
