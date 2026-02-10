import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { 
  AnalyticsReport, 
  ReportRequest, 
  RevenueAnalytics,
  SalesAnalytics,
  UserAnalytics,
  VendorAnalytics,
  CategoryAnalytics,
  ComparisonReport
} from '../models/analytics.model';

/**
 * AnalyticsService - Advanced reporting and business intelligence
 * 
 * Features:
 * - Generate comprehensive analytics reports
 * - Revenue, sales, user, vendor analytics
 * - Comparison reports (YoY, MoM)
 * - Export to PDF/Excel
 * - Pre-built report templates
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/analytics';

  /**
   * Generate analytics report based on request
   */
  generateReport(request: ReportRequest): Observable<AnalyticsReport> {
    let params = new HttpParams()
      .set('reportType', request.reportType)
      .set('period', request.period);

    if (request.dateFrom) {
      params = params.set('dateFrom', request.dateFrom.toISOString());
    }
    if (request.dateTo) {
      params = params.set('dateTo', request.dateTo.toISOString());
    }
    if (request.includeCharts !== undefined) {
      params = params.set('includeCharts', request.includeCharts.toString());
    }

    return this.http.get<AnalyticsReport>(`${this.API_URL}/report`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics(dateFrom?: Date, dateTo?: Date): Observable<RevenueAnalytics> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom.toISOString());
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo.toISOString());
    }

    return this.http.get<RevenueAnalytics>(`${this.API_URL}/revenue`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get sales analytics
   */
  getSalesAnalytics(dateFrom?: Date, dateTo?: Date): Observable<SalesAnalytics> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom.toISOString());
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo.toISOString());
    }

    return this.http.get<SalesAnalytics>(`${this.API_URL}/sales`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get user behavior analytics
   */
  getUserAnalytics(dateFrom?: Date, dateTo?: Date): Observable<UserAnalytics> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom.toISOString());
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo.toISOString());
    }

    return this.http.get<UserAnalytics>(`${this.API_URL}/users`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get vendor performance analytics
   */
  getVendorAnalytics(dateFrom?: Date, dateTo?: Date): Observable<VendorAnalytics> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom.toISOString());
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo.toISOString());
    }

    return this.http.get<VendorAnalytics>(`${this.API_URL}/vendors`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get category performance analytics
   */
  getCategoryAnalytics(dateFrom?: Date, dateTo?: Date): Observable<CategoryAnalytics> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom.toISOString());
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo.toISOString());
    }

    return this.http.get<CategoryAnalytics>(`${this.API_URL}/categories`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Get comparison report (e.g., this month vs last month)
   */
  getComparisonReport(
    reportType: 'revenue' | 'sales' | 'users',
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date
  ): Observable<ComparisonReport> {
    const params = new HttpParams()
      .set('reportType', reportType)
      .set('currentStart', currentStart.toISOString())
      .set('currentEnd', currentEnd.toISOString())
      .set('previousStart', previousStart.toISOString())
      .set('previousEnd', previousEnd.toISOString());

    return this.http.get<ComparisonReport>(`${this.API_URL}/comparison`, { params }).pipe(
      shareReplay(1)
    );
  }

  /**
   * Export report to file (PDF or Excel)
   */
  exportReport(request: ReportRequest): Observable<Blob> {
    let params = new HttpParams()
      .set('reportType', request.reportType)
      .set('period', request.period)
      .set('format', request.format || 'pdf');

    if (request.dateFrom) {
      params = params.set('dateFrom', request.dateFrom.toISOString());
    }
    if (request.dateTo) {
      params = params.set('dateTo', request.dateTo.toISOString());
    }

    return this.http.get(`${this.API_URL}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get quick insights (pre-calculated key metrics)
   */
  getQuickInsights(): Observable<{
    topMetric: string;
    topValue: number;
    alerts: string[];
    opportunities: string[];
  }> {
    return this.http.get<any>(`${this.API_URL}/insights`);
  }

  /**
   * Schedule recurring report email
   */
  scheduleReport(
    reportType: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    recipients: string[]
  ): Observable<{ success: boolean; scheduleId: string }> {
    return this.http.post<any>(`${this.API_URL}/schedule`, {
      reportType,
      frequency,
      recipients
    });
  }
}
