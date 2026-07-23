import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard - Protects admin routes
 * 
 * Checks:
 * 1. User is authenticated
 * 2. User has ADMIN role
 * 
 * If not authenticated: redirect to /login
 * If not admin: redirect to home
 * 
 * Returns UrlTree for reliable synchronous redirection (works with SSR)
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    console.warn('Unauthorized access attempt to admin area');
    // Return UrlTree for synchronous redirect (more reliable than router.navigate)
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Check if user has admin role
  if (!authService.isAdmin()) {
    console.warn('Non-admin user attempted to access admin area');
    return router.createUrlTree(['/']);
  }

  // User is authenticated and is admin
  return true;
};
