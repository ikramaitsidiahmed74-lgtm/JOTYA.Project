/**
 * Analytics & Reporting Models
 * Advanced analytics and business intelligence data structures
 */

/**
 * Report types available
 */
export type ReportType = 
  | 'revenue' 
  | 'sales' 
  | 'products' 
  | 'users' 
  | 'vendors'
  | 'categories';

/**
 * Time period for reports
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Revenue analytics
 */
export interface RevenueAnalytics {
  totalRevenue: number;
  netRevenue: number;
  grossRevenue: number;
  totalCommission: number;
  refundedAmount: number;
  averageOrderValue: number;
  revenueByMonth: MonthlyRevenue[];
  revenueByCategory: CategoryRevenue[];
  growthRate: number; // Percentage
  projectedRevenue: number; // Next month projection
}

/**
 * Monthly revenue breakdown
 */
export interface MonthlyRevenue {
  month: string; // e.g., "2024-01"
  revenue: number;
  orders: number;
  commission: number;
}

/**
 * Revenue by category
 */
export interface CategoryRevenue {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
  orderCount: number;
}

/**
 * Sales analytics
 */
export interface SalesAnalytics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  conversionRate: number; // Percentage
  averageOrderProcessingTime: number; // Hours
  salesByDay: DailySales[];
  salesByCategory: CategorySales[];
  topSellingProducts: ProductSales[];
}

/**
 * Daily sales data
 */
export interface DailySales {
  date: Date;
  orders: number;
  revenue: number;
  newCustomers: number;
}

/**
 * Category sales
 */
export interface CategorySales {
  categoryId: string;
  categoryName: string;
  orders: number;
  revenue: number;
  growthRate: number;
}

/**
 * Product sales performance
 */
export interface ProductSales {
  productId: number;
  productName: string;
  productImageUrl: string;
  quantitySold: number;
  revenue: number;
  views: number;
  conversionRate: number;
}

/**
 * User behavior analytics
 */
export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  churnRate: number; // Percentage
  averageLifetimeValue: number;
  userRetentionRate: number; // Percentage
  usersByRole: RoleDistribution[];
  userGrowthTrend: UserGrowthPoint[];
}

/**
 * User distribution by role
 */
export interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

/**
 * User growth data point
 */
export interface UserGrowthPoint {
  date: Date;
  newUsers: number;
  totalUsers: number;
  churnedUsers: number;
}

/**
 * Vendor performance analytics
 */
export interface VendorAnalytics {
  totalVendors: number;
  activeVendors: number;
  topVendors: TopVendorPerformance[];
  averageVendorRevenue: number;
  averageVendorRating: number;
  vendorRetentionRate: number;
}

/**
 * Top vendor performance
 */
export interface TopVendorPerformance {
  vendorId: number;
  vendorName: string;
  totalSales: number;
  totalRevenue: number;
  productCount: number;
  averageRating: number;
  responseTime: number; // Hours
}

/**
 * Category performance analytics
 */
export interface CategoryAnalytics {
  categories: CategoryPerformance[];
  topGrowingCategory: string;
  topDeclineCategory: string;
}

/**
 * Individual category performance
 */
export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  productCount: number;
  totalSales: number;
  revenue: number;
  growthRate: number; // Percentage
  averagePrice: number;
  popularityScore: number;
}

/**
 * Complete analytics report
 */
export interface AnalyticsReport {
  reportType: ReportType;
  period: TimePeriod;
  dateFrom: Date;
  dateTo: Date;
  revenue?: RevenueAnalytics;
  sales?: SalesAnalytics;
  users?: UserAnalytics;
  vendors?: VendorAnalytics;
  categories?: CategoryAnalytics;
  generatedAt: Date;
}

/**
 * Report generation request
 */
export interface ReportRequest {
  reportType: ReportType;
  period: TimePeriod;
  dateFrom?: Date;
  dateTo?: Date;
  includeCharts?: boolean;
  format?: 'json' | 'pdf' | 'excel';
}

/**
 * Comparison report (Year over Year, etc.)
 */
export interface ComparisonReport {
  currentPeriod: AnalyticsReport;
  previousPeriod: AnalyticsReport;
  percentageChange: {
    revenue: number;
    orders: number;
    users: number;
  };
}
