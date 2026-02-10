import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { 
  AdminOrder, 
  OrderFilters, 
  OrderListResponse, 
  OrderStats, 
  OrderStatusUpdate,
  ConflictResolution 
} from '../models/order-management.model';

/**
 * OrderService - Manages order/transaction operations
 * 
 * Features:
 * - Get paginated order list with filters
 * - Update order status
 * - Handle conflicts & resolutions
 * - Get order statistics
 * - Export orders
 * - Track shipments
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/orders';

  // Reactive state for orders
  private ordersSubject = new BehaviorSubject<AdminOrder[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  // Reactive state for total count
  private totalCountSubject = new BehaviorSubject<number>(0);
  public totalCount$ = this.totalCountSubject.asObservable();

  /**
   * Get paginated list of orders with filters
   */
  getOrders(
    page: number = 1,
    pageSize: number = 10,
    filters?: OrderFilters
  ): Observable<OrderListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Add filter params
    if (filters) {
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.status && filters.status !== 'ALL') {
        params = params.set('status', filters.status);
      }
      if (filters.paymentStatus && filters.paymentStatus !== 'ALL') {
        params = params.set('paymentStatus', filters.paymentStatus);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo.toISOString());
      }
      if (filters.minAmount !== undefined) {
        params = params.set('minAmount', filters.minAmount.toString());
      }
      if (filters.maxAmount !== undefined) {
        params = params.set('maxAmount', filters.maxAmount.toString());
      }
      if (filters.clientId) {
        params = params.set('clientId', filters.clientId.toString());
      }
      if (filters.vendorId) {
        params = params.set('vendorId', filters.vendorId.toString());
      }
    }

    return this.http.get<OrderListResponse>(`${this.API_URL}`, { params }).pipe(
      tap(response => {
        this.ordersSubject.next(response.orders);
        this.totalCountSubject.next(response.total);
      })
    );
  }

  /**
   * Get single order by ID
   */
  getOrderById(id: string): Observable<AdminOrder> {
    return this.http.get<AdminOrder>(`${this.API_URL}/${id}`);
  }

  /**
   * Update order status
   */
  updateOrderStatus(id: string, update: OrderStatusUpdate): Observable<AdminOrder> {
    return this.http.put<AdminOrder>(`${this.API_URL}/${id}/status`, update).pipe(
      tap(updatedOrder => {
        this.updateOrderInState(id, updatedOrder);
      })
    );
  }

  /**
   * Mark order as shipped
   */
  markAsShipped(id: string, trackingNumber: string): Observable<AdminOrder> {
    return this.updateOrderStatus(id, {
      status: 'Expédié',
      trackingNumber
    });
  }

  /**
   * Mark order as delivered
   */
  markAsDelivered(id: string): Observable<AdminOrder> {
    return this.updateOrderStatus(id, {
      status: 'Livré'
    });
  }

  /**
   * Cancel order
   */
  cancelOrder(id: string, reason: string): Observable<AdminOrder> {
    return this.http.post<AdminOrder>(`${this.API_URL}/${id}/cancel`, { reason }).pipe(
      tap(updatedOrder => {
        this.updateOrderInState(id, updatedOrder);
      })
    );
  }

  /**
   * Report order conflict
   */
  reportConflict(id: string, reason: string): Observable<AdminOrder> {
    return this.http.post<AdminOrder>(`${this.API_URL}/${id}/conflict`, { reason }).pipe(
      tap(updatedOrder => {
        this.updateOrderInState(id, updatedOrder);
      })
    );
  }

  /**
   * Resolve order conflict
   */
  resolveConflict(id: string, resolution: ConflictResolution): Observable<AdminOrder> {
    return this.http.post<AdminOrder>(`${this.API_URL}/${id}/resolve-conflict`, resolution).pipe(
      tap(updatedOrder => {
        this.updateOrderInState(id, updatedOrder);
      })
    );
  }

  /**
   * Process refund
   */
  processRefund(id: string, amount: number, reason: string): Observable<AdminOrder> {
    return this.http.post<AdminOrder>(`${this.API_URL}/${id}/refund`, { amount, reason }).pipe(
      tap(updatedOrder => {
        this.updateOrderInState(id, updatedOrder);
      })
    );
  }

  /**
   * Get order statistics for dashboard
   */
  getOrderStats(): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.API_URL}/stats`);
  }

  /**
   * Get orders in conflict
   */
  getConflictOrders(page: number = 1, pageSize: number = 10): Observable<OrderListResponse> {
    return this.getOrders(page, pageSize, { status: 'Conflit' });
  }

  /**
   * Get recent orders (last N days)
   */
  getRecentOrders(days: number = 7): Observable<AdminOrder[]> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    return this.http.get<AdminOrder[]>(`${this.API_URL}/recent`, {
      params: new HttpParams().set('days', days.toString())
    });
  }

  /**
   * Get orders by client
   */
  getOrdersByClient(clientId: number, page: number = 1, pageSize: number = 10): Observable<OrderListResponse> {
    return this.getOrders(page, pageSize, { clientId });
  }

  /**
   * Get orders by vendor
   */
  getOrdersByVendor(vendorId: number, page: number = 1, pageSize: number = 10): Observable<OrderListResponse> {
    return this.getOrders(page, pageSize, { vendorId });
  }

  /**
   * Export orders to CSV
   */
  exportOrders(filters?: OrderFilters): Observable<Blob> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status && filters.status !== 'ALL') {
        params = params.set('status', filters.status);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo.toISOString());
      }
    }

    return this.http.get(`${this.API_URL}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Search orders
   */
  searchOrders(query: string, page: number = 1, pageSize: number = 10): Observable<OrderListResponse> {
    return this.getOrders(page, pageSize, { search: query });
  }

  /**
   * Helper: Update order in local state
   */
  private updateOrderInState(id: string, updatedOrder: AdminOrder): void {
    const currentOrders = this.ordersSubject.value;
    const index = currentOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      currentOrders[index] = updatedOrder;
      this.ordersSubject.next([...currentOrders]);
    }
  }

  /**
   * Clear local state
   */
  clearState(): void {
    this.ordersSubject.next([]);
    this.totalCountSubject.next(0);
  }
}
