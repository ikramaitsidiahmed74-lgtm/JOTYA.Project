import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Error Interceptor - Handles HTTP errors globally
 * 
 * Handles:
 * - 401 Unauthorized: Token expired or invalid -> logout and redirect to login
 * - 403 Forbidden: Insufficient permissions -> redirect to home
 * - 500+ Server errors: Log and show user-friendly message
 * 
 * All errors are passed through for component-level handling as well
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Handle different error status codes
      switch (error.status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('401 Unauthorized - Logging out user');
          authService.logout();
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('403 Forbidden - Access denied');
          router.navigate(['/']);
          break;

        case 404:
          // Not found
          console.error('404 Not Found:', req.url);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error(`${error.status} Server Error:`, error.message);
          // You could show a global error toast here
          break;

        case 0:
          // Network error or CORS issue
          console.error('Network error - Check backend connection');
          break;

        default:
          console.error(`HTTP Error ${error.status}:`, error.message);
      }

      // Re-throw error so components can handle it too
      return throwError(() => error);
    })
  );
};
