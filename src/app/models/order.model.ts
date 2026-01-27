import { CartItem } from './cart-item.model';
import { PaymentInfo } from './payment-info.model';

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderDeliveryInfo {
  city: string;
  address: string;
  deliveryMethod: string; // MVP (future: union/enum)
}

export interface OrderTotals {
  subtotal: number;
  authenticationFee: number;
  shipping: number;
  total: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: OrderCustomerInfo;
  delivery: OrderDeliveryInfo;
  payment: PaymentInfo;
  totals: OrderTotals;
}

