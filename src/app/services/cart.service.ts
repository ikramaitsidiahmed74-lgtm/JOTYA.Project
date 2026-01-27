import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'jotya_cart_v1';

  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readInitialCart());
  readonly items$ = this.itemsSubject.asObservable();

  /**
   * Adds an item to the cart or increments its quantity if it already exists.
   */
  addItem(product: Product, quantity = 1): void {
    const items = [...this.itemsSubject.value];
    const index = items.findIndex((item) => item.product.id === product.id);

    if (index >= 0) {
      const existing = items[index];
      items[index] = { ...existing, quantity: Math.max(1, existing.quantity + quantity) };
    } else {
      items.push({ product, quantity: Math.max(1, quantity) });
    }

    this.persist(items);
  }

  /**
   * Updates quantity by a delta while keeping quantity >= 1.
   */
  updateQuantity(productId: string, delta: number): void {
    const items = this.itemsSubject.value.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    this.persist(items);
  }

  removeItem(productId: string): void {
    const items = this.itemsSubject.value.filter((item) => item.product.id !== productId);
    this.persist(items);
  }

  clear(): void {
    this.persist([]);
  }

  getSubtotal(items: CartItem[] = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getItemsCount(items: CartItem[] = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  isEmpty(): boolean {
    return this.itemsSubject.value.length === 0;
  }

  private readInitialCart(): CartItem[] {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
      if (stored) {
        return JSON.parse(stored) as CartItem[];
      }
    } catch (error) {
      console.warn('Failed to parse cart from storage', error);
    }
    return [];
  }

  private persist(items: CartItem[]): void {
    this.itemsSubject.next(items);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      }
    } catch (error) {
      console.warn('Failed to persist cart to storage', error);
    }
  }
}
