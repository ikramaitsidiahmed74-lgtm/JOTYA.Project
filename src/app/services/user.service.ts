import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User, UserFormData, UserFilters, UserListResponse, UserStats } from '../models/user.model';

/**
 * UserService - Manages user CRUD operations
 * 
 * Features:
 * - Get paginated user list with filters
 * - Create/Update/Delete users
 * - Search users
 * - Suspend/Activate users
 * - Get user statistics
 * - Reactive user state management
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/users';

  // Reactive state for user list
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  // Reactive state for total count
  private totalCountSubject = new BehaviorSubject<number>(0);
  public totalCount$ = this.totalCountSubject.asObservable();

  /**
   * Get paginated list of users with filters
   */
  getUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: UserFilters
  ): Observable<UserListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Add filter params if provided
    if (filters) {
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.role && filters.role !== 'ALL') {
        params = params.set('role', filters.role);
      }
      if (filters.status && filters.status !== 'ALL') {
        params = params.set('status', filters.status);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo.toISOString());
      }
      if (filters.minRevenue !== undefined) {
        params = params.set('minRevenue', filters.minRevenue.toString());
      }
      if (filters.maxRevenue !== undefined) {
        params = params.set('maxRevenue', filters.maxRevenue.toString());
      }
    }

    return this.http.get<UserListResponse>(`${this.API_URL}`, { params }).pipe(
      tap(response => {
        this.usersSubject.next(response.users);
        this.totalCountSubject.next(response.total);
      })
    );
  }

  /**
   * Get single user by ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new user
   */
  createUser(userData: UserFormData): Observable<User> {
    return this.http.post<User>(`${this.API_URL}`, userData).pipe(
      tap(newUser => {
        // Update local state
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([newUser, ...currentUsers]);
        this.totalCountSubject.next(this.totalCountSubject.value + 1);
      })
    );
  }

  /**
   * Update existing user
   */
  updateUser(id: number, userData: Partial<UserFormData>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, userData).pipe(
      tap(updatedUser => {
        // Update local state
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersSubject.next([...currentUsers]);
        }
      })
    );
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        // Update local state
        const currentUsers = this.usersSubject.value.filter(u => u.id !== id);
        this.usersSubject.next(currentUsers);
        this.totalCountSubject.next(this.totalCountSubject.value - 1);
      })
    );
  }

  /**
   * Suspend user account
   */
  suspendUser(id: number, reason?: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/${id}/suspend`, { reason }).pipe(
      tap(updatedUser => {
        this.updateUserInState(id, updatedUser);
      })
    );
  }

  /**
   * Activate suspended user account
   */
  activateUser(id: number): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/${id}/activate`, {}).pipe(
      tap(updatedUser => {
        this.updateUserInState(id, updatedUser);
      })
    );
  }

  /**
   * Ban user permanently
   */
  banUser(id: number, reason: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/${id}/ban`, { reason }).pipe(
      tap(updatedUser => {
        this.updateUserInState(id, updatedUser);
      })
    );
  }

  /**
   * Search users by query (debounced on component side)
   */
  searchUsers(query: string, page: number = 1, pageSize: number = 10): Observable<UserListResponse> {
    return this.getUsers(page, pageSize, { search: query });
  }

  /**
   * Get user statistics for dashboard
   */
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.API_URL}/stats`);
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string, page: number = 1, pageSize: number = 10): Observable<UserListResponse> {
    return this.getUsers(page, pageSize, { role: role as any });
  }

  /**
   * Get new users (registered in last N days)
   */
  getNewUsers(days: number = 30): Observable<User[]> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    return this.http.get<User[]>(`${this.API_URL}/new`, {
      params: new HttpParams().set('days', days.toString())
    });
  }

  /**
   * Export users to CSV
   */
  exportUsers(filters?: UserFilters): Observable<Blob> {
    let params = new HttpParams();

    if (filters) {
      if (filters.role && filters.role !== 'ALL') {
        params = params.set('role', filters.role);
      }
      if (filters.status && filters.status !== 'ALL') {
        params = params.set('status', filters.status);
      }
    }

    return this.http.get(`${this.API_URL}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Helper: Update user in local state
   */
  private updateUserInState(id: number, updatedUser: User): void {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      currentUsers[index] = updatedUser;
      this.usersSubject.next([...currentUsers]);
    }
  }

  /**
   * Clear local state (useful for logout)
   */
  clearState(): void {
    this.usersSubject.next([]);
    this.totalCountSubject.next(0);
  }
}
