import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaymentMethod } from '../models/payment-method.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly storageKey = 'jotya_payment_method_v1';

  private readonly paymentMethodSubject = new BehaviorSubject<PaymentMethod | null>(this.readInitialMethod());
  readonly paymentMethod$ = this.paymentMethodSubject.asObservable();

  setPaymentMethod(method: PaymentMethod): void {
    this.paymentMethodSubject.next(method);
    this.persist(method);
  }

  clearPaymentMethod(): void {
    this.paymentMethodSubject.next(null);
    this.persist(null);
  }

  getSnapshot(): PaymentMethod | null {
    return this.paymentMethodSubject.value;
  }

  private readInitialMethod(): PaymentMethod | null {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
      return stored ? (stored as PaymentMethod) : null;
    } catch (error) {
      console.warn('Failed to read payment method', error);
      return null;
    }
  }

  private persist(method: PaymentMethod | null): void {
    try {
      if (typeof localStorage !== 'undefined') {
        if (method) {
          localStorage.setItem(this.storageKey, method);
        } else {
          localStorage.removeItem(this.storageKey);
        }
      }
    } catch (error) {
      console.warn('Failed to persist payment method', error);
    }
  }
}
