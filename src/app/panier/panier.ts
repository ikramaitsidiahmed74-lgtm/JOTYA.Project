import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { PaymentMethod } from '../models/payment-method.model';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css'],
})


export class Panier implements OnInit {
  readonly authenticationFee = 250;
  readonly shippingCost = 0;

  readonly paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'credit-card', label: 'Carte Bancaire', icon: 'credit_card' },
    { id: 'paypal', label: 'PayPal', icon: 'account_balance_wallet' },
    { id: 'google-pay', label: 'Google Pay', icon: 'wallet' },
    { id: 'visa-mastercard', label: 'Visa / Mastercard', icon: 'credit_card_gear' },
    { id: 'bank-transfer', label: 'Virement / Cash', icon: 'payments' },
  ];

 
  cartItems$!: Observable<CartItem[]>;
  paymentMethod$!: Observable<PaymentMethod | null>;
  totals$!: Observable<{ subtotal: number; itemsCount: number; total: number }>;

  feedbackMessage = '';

  constructor(
    private readonly cartService: CartService,
    private readonly checkoutService: CheckoutService,
    private readonly router: Router
  )
   {
    this.cartItems$ = this.cartService.items$;
    this.paymentMethod$ = this.checkoutService.paymentMethod$;
    this.totals$ = this.cartItems$.pipe(
      map((items) => {
        const subtotal = this.cartService.getSubtotal(items);
        const itemsCount = this.cartService.getItemsCount(items);
        const total = subtotal + this.authenticationFee + this.shippingCost;
        return { subtotal, itemsCount, total };
      })
    );
  }

  ngOnInit(): void {
    // Seed demo data to showcase the UI when the cart is empty.
    if (this.cartService.isEmpty()) {
      this.addDemoProducts();
    }
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, 1);
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, -1);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.checkoutService.setPaymentMethod(method);
  }

  confirmOrder(): void {
    const items = this.cartService.getSnapshot();
    const paymentMethod = this.checkoutService.getSnapshot();

    if (!items.length) {
      this.feedbackMessage = 'Votre panier est vide.';
      return;
    }

    if (!paymentMethod) {
      this.feedbackMessage = 'Veuillez choisir un moyen de paiement.';
      return;
    }

    // Proceed to the checkout page. Order submission happens in CheckoutComponent (MVP).
    void this.router.navigateByUrl('/checkout');
  }

  trackByProductId(_: number, item: CartItem): string {
    return item.product.id;
  }

  private addDemoProducts(): void {
    const demoProducts: Product[] = [
      {
        id: 'bag-001',
        name: 'Sac Classique Flap Bag',
        brand: 'Chanel',
        condition: 'État Excellent',
        price: 45000,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAm3lIXjcWnAHidlAuvYIo_k6pPr1ObErz6pchdOdiijWInqCvtIwPbMn93u6jphaSAYWKRHvSXKPwrFOL-6xsAIe3N6rPi-u--rTf3LszEhtBKSFFjbXXYyYGqNW8tqT7vRXlN5tnpEdnEm3obmE2a-duccw5r9o1jJznv29SjuG1-Q7YsSjgq6iRMs_UevtC25hSBCGrIVCn_eVTQ0H6N9OLhERM0ERc6ae45jlfR7giaib6smuD1snRpRR1mtBjqHe5zYnX_X1nx',
      },
      {
        id: 'watch-001',
        name: 'Submariner Date',
        brand: 'Rolex',
        condition: 'Certifié Authentique',
        price: 125000,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAwhYhAxSSE6_yKUEQIFgwaIqsCJx8gMtr1cRRgMEDU2Dc2jZEFt6Vg9oVzh0IYdDyXCGj4oqHmrIY8SDEvUJbezETkAgt61TNoA_1aO4Vrlv_xLE_Prgsk0MivSzJSw2Az7Gb-4J6PC9jThtzC24a-llDbuVf7O_oMV_Yhqefau37BsQojfOLmkc1x51HKsa8GEUF9WcjlSm0pPXmHbD2tPQLhu01WBdWK-VSBHBSvJBlV5M0R3j1-sL80yYCCcdKyBvfJITVGAQxw',
      },
    ];

    demoProducts.forEach((product) => this.cartService.addItem(product));
  }
}
