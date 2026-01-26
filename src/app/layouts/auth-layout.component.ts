import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  protected readonly title = signal('JOTYA');

  constructor(private router: Router) {}

  // ✅ SSR SAFE
  get isVendeurRoute(): boolean {
    return this.router.url.includes('vendeur');
  }

  get image(): string {
    return this.isVendeurRoute
      ? 'assets/images/auth-vendeur.jpg'
      : 'assets/images/auth-client.jpg';
  }

  get imageLabel(): string {
    return this.isVendeurRoute
      ? 'ESPACE PARTENAIRE'
      : 'COLLECTION ÉTERNELLE';
  }
}
