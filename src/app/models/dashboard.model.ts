/**
 * Dashboard KPI Models
 * Aggregated metrics and statistics for admin dashboard
 */

/**
 * Main dashboard KPIs
 */
export interface DashboardKPIs {
  revenue: RevenueKPI;
  users: UserKPI;
  products: ProductKPI;
  orders: OrderKPI;
  conversion: ConversionKPI;
}

/**
 * Revenue metrics
 */
export interface RevenueKPI {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growthPercentage: number;
  commission: number;
  averageOrderValue: number;
}

/**
 * User metrics
 */
export interface UserKPI {
  totalActive: number;
  newThisMonth: number;
  newLastMonth: number;
  growthPercentage: number;
  clientCount: number;
  vendorCount: number;
}

/**
 * Product metrics
 */
export interface ProductKPI {
  totalProducts: number;
  pendingValidation: number;
  approvedToday: number;
  rejectedToday: number;
  totalViews: number;
  totalFavorites: number;
}

/**
 * Order metrics
 */
export interface OrderKPI {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  conflictOrders: number;
  averageProcessingTime: number; // in hours
}

/**
 * Conversion metrics
 */
export interface ConversionKPI {
  conversionRate: number; // Percentage
  cartAbandonmentRate: number; // Percentage
  averageCartValue: number;
  totalVisitors: number;
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  date: Date;
  value: number;
  label?: string;
}

/**
 * Chart data for dashboard
 */
export interface DashboardChartData {
  revenue: TimeSeriesDataPoint[];
  orders: TimeSeriesDataPoint[];
  users: TimeSeriesDataPoint[];
}

/**
 * Recent activity item
 */
export interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'product' | 'review';
  title: string;
  description: string;
  timestamp: Date;
  severity?: 'info' | 'warning' | 'error' | 'success';
  userId?: number;
  userName?: string;
}

/**
 * Top performing product
 */
export interface TopProduct {
  id: number;
  name: string;
  imageUrl: string;
  sales: number;
  revenue: number;
  views: number;
  category: string;
}

/**
 * Top performing vendor
 */
export interface TopVendor {
  id: number;
  name: string;
  email: string;
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  rating: number;
}

/**
 * Dashboard summary (complete overview)
 */
export interface DashboardSummary {
  kpis: DashboardKPIs;
  charts: DashboardChartData;
  recentActivity: RecentActivity[];
  topProducts: TopProduct[];
  topVendors: TopVendor[];
  pendingValidations: number;
  conflictOrders: number;
  lastUpdated: Date;
}

/**
 * Dashboard filter options
 */
export interface DashboardFilters {
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  dateFrom?: Date;
  dateTo?: Date;
  compareWithPrevious?: boolean;
}
