import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

/**
 * Admin Login Page
 * Simple login form for admin authentication
 * 
 * Features:
 * - Email/password form with validation
 * - Loading state during login
 * - Error handling
 * - Redirect to returnUrl or dashboard after successful login
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#FFFBF2] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">JOTYA</h1>
          <p class="text-gray-600 mt-2">Administration</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Connexion Admin</h2>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffed00] focus:border-transparent"
                [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder="admin@jotya.ma"
              />
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-1 text-xs text-red-600">
                Email valide requis
              </div>
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffed00] focus:border-transparent"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="••••••••"
              />
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-1 text-xs text-red-600">
                Mot de passe requis
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-[#ffed00] text-black font-semibold py-3 rounded-lg hover:bg-[#ffe100] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Connexion...
              </span>
            </button>
          </form>

          <!-- Demo Credentials (for testing) -->
          <div class="mt-6 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p class="font-semibold mb-1">Démo:</p>
            <p>Email: admin@jotya.ma</p>
            <p>Password: admin123</p>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <a routerLink="/" class="text-sm text-gray-600 hover:text-gray-900">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    // Initialize form with validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // If already logged in, redirect to admin
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate(['/dashboard/admin']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          // Get return URL from query params or default to admin dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/admin';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          console.error('Login error:', error);
          
          // Set user-friendly error message
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 0) {
            this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
  }
}
