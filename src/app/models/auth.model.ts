/**
 * Authentication Models & Interfaces
 * Define all auth-related types for type safety
 */

export type UserRole = 'ADMIN' | 'CLIENT' | 'VENDEUR';
export type UserStatus = 'ACTIF' | 'BANNI' | 'SUSPENDU';

/**
 * User interface - represents authenticated user
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  registrationDate?: Date;
  totalRevenue?: number;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * JWT Token Payload (decoded)
 */
export interface JwtPayload {
  sub: number;        // User ID
  email: string;
  role: UserRole;
  exp: number;        // Expiration timestamp
  iat?: number;       // Issued at timestamp
}
