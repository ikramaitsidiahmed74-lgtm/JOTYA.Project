import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendeur-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendeur-register.html'
})
export class VendeurRegisterComponent {
  constructor(private router: Router) {}

  start() {
    this.router.navigate(['/auth/vendeur-profil']);
  }
}
