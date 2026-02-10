/**
 * Order/Transaction Management Models (Admin)
 * Extended order types for admin dashboard management
 */

/**
 * Order status types
 */
export type OrderStatus = 
  | 'En préparation' 
  | 'Expédié' 
  | 'Livré' 
  | 'Conflit' 
  | 'Annulé'
  | 'Remboursé';

/**
 * Payment method types
 */
export type PaymentMethod = 'CMI' | 'PayPal' | 'Cash' | 'Bank Transfer';

/**
 * Payment status
 */
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

/**
 * Admin Order interface (extended version)
 */
export interface AdminOrder {
  id: string;
  orderNumber: string;
  
  // Parties involved
  clientId: number;
  clientName: string;
  clientEmail: string;
  
  vendorId: number;
  vendorName: string;
  vendorEmail: string;
  
  // Financial details
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  commission: number;
  commissionRate: number; // Percentage (e.g., 10 for 10%)
  
  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  
  // Status & dates
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  
  // Shipping
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  
  // Notes & issues
  notes?: string;
  conflictReason?: string;
  cancellationReason?: string;
}

/**
 * Shipping address
 */
export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
}

/**
 * Order filters for search/pagination
 */
export interface OrderFilters {
  search?: string; // Order number, client name, vendor name
  status?: OrderStatus | 'ALL';
  paymentStatus?: PaymentStatus | 'ALL';
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  clientId?: number;
  vendorId?: number;
}

/**
 * Paginated order list response
 */
export interface OrderListResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Order statistics
 */
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  averageOrderValue: number;
  
  // By status
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  conflictOrders: number;
  cancelledOrders: number;
  
  // Growth
  ordersThisMonth: number;
  revenueThisMonth: number;
  growthPercentage: number;
}

/**
 * Order status update payload
 */
export interface OrderStatusUpdate {
  status: OrderStatus;
  notes?: string;
  trackingNumber?: string;
}

/**
 * Conflict resolution payload
 */
export interface ConflictResolution {
  resolution: 'refund' | 'replace' | 'partial_refund' | 'dismiss';
  notes: string;
  refundAmount?: number;
}
