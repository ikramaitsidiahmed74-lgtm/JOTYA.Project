import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connexion.html',
})
export class Connexion {

  showLogoutModal = true; // باش يبان modal

  constructor(private router: Router) {}

  closeLogout() {
    this.showLogoutModal = false;
  }

  logout() {
    // مثال: حذف token
    localStorage.clear();

    // رجوع لصفحة login
    this.router.navigate(['/login']);

    this.showLogoutModal = false;
  }
}
