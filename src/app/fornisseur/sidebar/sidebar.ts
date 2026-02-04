import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
isDashboardRoute(): any {
throw new Error('Method not implemented.');
}

   showLogoutModal = false;

  openLogout() {
    this.showLogoutModal = true;
  }

  closeLogout() {
    this.showLogoutModal = false;
  }

  logout() {
    // هنا من بعد تقدر دير clear token / redirect
    console.log('Déconnecté');
    this.showLogoutModal = false;
  }

  menuItems: MenuItem[] = [
    { label: 'Tableau de Bord', route: '/dashboard' },
    { label: 'Mes Produits', route: '/products' },
    { label: 'Ventes', route: '/sales' },
    { label: 'Commandes', route: '/orders' },
    { label: 'Messages', route: '/messages' },
    { label: 'VOIR TOUT', route: '/messages' },
    { label: 'Paramètres', route: '/settings' },
    { label: 'Déconnexion', route: '/connexion' },
  ];
}
