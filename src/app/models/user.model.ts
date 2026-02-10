/**
 * User Management Models
 * Types and interfaces for user CRUD operations
 */

import { UserRole, UserStatus } from './auth.model';

/**
 * Extended User interface for admin management
 * Includes all user profile data
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  registrationDate: Date;
  totalRevenue: number;
  orderCount?: number;
  lastLogin?: Date;
  address?: Address;
}

/**
 * Address information
 */
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * User creation/update payload
 */
export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  password?: string; // Only for creation
}

/**
 * User search/filter parameters
 */
export interface UserFilters {
  search?: string;
  role?: UserRole | 'ALL';
  status?: UserStatus | 'ALL';
  dateFrom?: Date;
  dateTo?: Date;
  minRevenue?: number;
  maxRevenue?: number;
}

/**
 * Paginated user list response
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * User statistics for dashboard
 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
  clientCount: number;
  vendorCount: number;
  adminCount: number;
  totalRevenue: number;
  averageRevenue: number;
}
