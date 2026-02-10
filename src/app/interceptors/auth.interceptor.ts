import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor - Injects JWT token into HTTP requests
 * 
 * Automatically adds Authorization header to all outgoing requests
 * Format: Authorization: Bearer <token>
 * 
 * Skips token injection for:
 * - Login/register endpoints
 * - External APIs
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Get token from AuthService
  const token = authService.getToken();

  // Skip token injection for specific URLs
  const skipUrls = ['/api/auth/login', '/api/auth/register'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));

  // If no token or should skip, proceed without modification
  if (!token || shouldSkip) {
    return next(req);
  }

  // Clone request and add Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
