import { PaymentMethod } from './payment-method.model';

export interface CardPaymentInfo {
  method: 'credit-card' | 'visa-mastercard';
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface PaypalPaymentInfo {
  method: 'paypal';
  paypalEmail: string;
}

export interface GooglePayPaymentInfo {
  method: 'google-pay';
}

export interface BankTransferPaymentInfo {
  method: 'bank-transfer';
}

export type PaymentInfo =
  | CardPaymentInfo
  | PaypalPaymentInfo
  | GooglePayPaymentInfo
  | BankTransferPaymentInfo;

export function isCardMethod(method: PaymentMethod | null): method is 'credit-card' | 'visa-mastercard' {
  return method === 'credit-card' || method === 'visa-mastercard';
}

