import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, JwtPayload, UserRole } from '../models/auth.model';

/**
 * AuthService - Handles all authentication logic
 * 
 * Features:
 * - JWT token management (localStorage)
 * - Login/Logout
 * - User state management (reactive)
 * - Role-based access control
 * - Token validation & decoding
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // API endpoints - adjust based on your backend
  private readonly API_URL = '/api/auth';
  
  // Token storage key
  private readonly TOKEN_KEY = 'jotya_admin_token';

  // Admin credentials (for local/testing auth when no backend is available)
  private readonly ADMIN_EMAIL = 'jotya@store.com';
  private readonly ADMIN_PASSWORD = 'jotya123';
  
  // Current user state (reactive)
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromToken());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Validate token on service initialization
    this.validateStoredToken();
  }

  /**
   * Get current user value (synchronous)
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    return !this.isTokenExpired(token);
  }

  /**
   * Check if current user has specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.currentUserValue;
    return user !== null && user.role === role;
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Login user with email and password
   * Falls back to local admin auth when no backend is available
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Local admin authentication (no backend needed)
    if (credentials.email === this.ADMIN_EMAIL && credentials.password === this.ADMIN_PASSWORD) {
      return this.loginLocalAdmin();
    }

    // For non-admin credentials, try API
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => ({ status: 401, message: 'Email ou mot de passe incorrect' }));
      })
    );
  }

  /**
   * Local admin login - generates a JWT-like token for testing
   */
  private loginLocalAdmin(): Observable<AuthResponse> {
    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      sub: 1,
      email: this.ADMIN_EMAIL,
      role: 'ADMIN',
      exp: now + (24 * 60 * 60), // 24 hours
      iat: now
    };

    // Create a simple base64 token (header.payload.signature)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    const signature = btoa('local-dev-signature');
    const token = `${header}.${body}.${signature}`;

    const user: User = {
      id: 1,
      name: 'Admin JOTYA',
      email: this.ADMIN_EMAIL,
      role: 'ADMIN',
      status: 'ACTIF'
    };

    const response: AuthResponse = { token, user };

    // Store token and update state
    this.setToken(token);
    this.currentUserSubject.next(user);

    return of(response);
  }

  /**
   * Logout current user
   */
  logout(): void {
    // Optional: Call backend logout endpoint
    this.http.post(`${this.API_URL}/logout`, {}).pipe(
      catchError(() => of(null)) // Ignore errors, logout anyway
    ).subscribe();

    // Clear local state
    this.clearToken();
    this.currentUserSubject.next(null);
    
    // Redirect to login
    this.router.navigate(['/login']);
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store JWT token
   */
  private setToken(token: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Clear stored token
   */
  private clearToken(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    
    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate < new Date();
  }

  /**
   * Get user from stored token
   */
  private getCurrentUserFromToken(): User | null {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      return null;
    }

    // Reconstruct user from token payload
    // Note: In production, you might want to fetch full user data from API
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: '', // Will be populated from API or full token
      status: 'ACTIF'
    };
  }

  /**
   * Validate stored token on app initialization
   */
  private validateStoredToken(): void {
    const token = this.getToken();
    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }

    if (this.isTokenExpired(token)) {
      console.warn('Stored token is expired, clearing...');
      this.clearToken();
      this.currentUserSubject.next(null);
      return;
    }

    // Token is valid, user is already set in constructor
  }

  /**
   * Refresh user data from API (optional)
   * Call this after login if you need full user profile
   */
  refreshUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Failed to refresh user profile:', error);
        // If refresh fails, logout
        this.logout();
        return throwError(() => error);
      })
    );
  }
}
