import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { tap, switchMap, shareReplay } from 'rxjs/operators';
import { 
  DashboardSummary, 
  DashboardKPIs, 
  DashboardChartData, 
  RecentActivity,
  TopProduct,
  TopVendor,
  DashboardFilters 
} from '../models/dashboard.model';

/**
 * DashboardService - Aggregates KPIs and metrics
 * 
 * Features:
 * - Fetch all dashboard KPIs
 * - Get chart data for visualizations
 * - Real-time updates (optional polling)
 * - Date range filtering
 * - Caching for performance
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/dashboard';

  // Auto-refresh interval (30 seconds)
  private readonly REFRESH_INTERVAL = 30000;

  // Reactive state for dashboard summary
  private summarySubject = new BehaviorSubject<DashboardSummary | null>(null);
  public summary$ = this.summarySubject.asObservable();

  // Cache for expensive queries
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 60000; // 1 minute

  /**
   * Get complete dashboard summary
   */
  getDashboardSummary(filters?: DashboardFilters): Observable<DashboardSummary> {
    let params = new HttpParams();

    if (filters) {
      params = params.set('dateRange', filters.dateRange);
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo.toISOString());
      }
      if (filters.compareWithPrevious) {
        params = params.set('compareWithPrevious', 'true');
      }
    }

    return this.http.get<DashboardSummary>(`${this.API_URL}/summary`, { params }).pipe(
      tap(summary => {
        this.summarySubject.next(summary);
      }),
      shareReplay(1) // Cache for multiple subscribers
    );
  }

  /**
   * Get only KPIs (lighter than full summary)
   */
  getKPIs(filters?: DashboardFilters): Observable<DashboardKPIs> {
    let params = new HttpParams();

    if (filters?.dateRange) {
      params = params.set('dateRange', filters.dateRange);
    }

    return this.http.get<DashboardKPIs>(`${this.API_URL}/kpis`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get chart data for visualizations
   */
  getChartData(
    metric: 'revenue' | 'orders' | 'users',
    days: number = 30
  ): Observable<DashboardChartData> {
    const params = new HttpParams()
      .set('metric', metric)
      .set('days', days.toString());

    return this.http.get<DashboardChartData>(`${this.API_URL}/charts`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get recent activity feed
   */
  getRecentActivity(limit: number = 10): Observable<RecentActivity[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<RecentActivity[]>(`${this.API_URL}/activity`, { params });
  }

  /**
   * Get top performing products
   */
  getTopProducts(limit: number = 5, period: 'week' | 'month' | 'year' = 'month'): Observable<TopProduct[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('period', period);

    return this.http.get<TopProduct[]>(`${this.API_URL}/top-products`, { params });
  }

  /**
   * Get top performing vendors
   */
  getTopVendors(limit: number = 5, period: 'week' | 'month' | 'year' = 'month'): Observable<TopVendor[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('period', period);

    return this.http.get<TopVendor[]>(`${this.API_URL}/top-vendors`, { params });
  }

  /**
   * Enable auto-refresh for dashboard (call in component ngOnInit)
   * Returns observable that emits every REFRESH_INTERVAL
   */
  enableAutoRefresh(filters?: DashboardFilters): Observable<DashboardSummary> {
    return interval(this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.getDashboardSummary(filters))
    );
  }

  /**
   * Get data from cache if available and fresh
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Store data in cache
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear state
   */
  clearState(): void {
    this.summarySubject.next(null);
    this.clearCache();
  }

  /**
   * Export dashboard report (PDF or Excel)
   */
  exportDashboard(format: 'pdf' | 'excel', filters?: DashboardFilters): Observable<Blob> {
    let params = new HttpParams().set('format', format);

    if (filters?.dateRange) {
      params = params.set('dateRange', filters.dateRange);
    }

    return this.http.get(`${this.API_URL}/export`, {
      params,
      responseType: 'blob'
    });
  }
}
