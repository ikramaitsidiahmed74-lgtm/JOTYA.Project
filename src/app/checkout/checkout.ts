import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Order } from '../models/order.model';
import { isCardMethod } from '../models/payment-info.model';
import { PaymentMethod } from '../models/payment-method.model';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class CheckoutComponent implements OnDestroy {
  readonly authenticationFee = 250;
  readonly shippingCost = 0;

  cartItems$!: Observable<CartItem[]>;
  paymentMethod$!: Observable<PaymentMethod | null>;
  totals$!: Observable<{ subtotal: number; itemsCount: number; total: number }>;
  form!: CheckoutForm;

  message = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly checkoutService: CheckoutService,
    private readonly router: Router
  ) {
    this.form = this.buildForm();

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

    // Apply validators dynamically based on selected payment method.
    this.paymentMethod$.pipe(takeUntil(this.destroy$)).subscribe((method) => {
      this.applyPaymentValidators(method);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProductId(_: number, item: CartItem): string {
    return item.product.id;
  }

  placeOrder(): void {
    this.message = '';

    const items = this.cartService.getSnapshot();
    const method = this.checkoutService.getSnapshot();

    if (!items.length) {
      this.message = 'Votre panier est vide.';
      return;
    }

    if (!method) {
      this.message = 'Veuillez choisir un moyen de paiement dans le panier.';
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.message = 'Veuillez vérifier les champs requis.';
      return;
    }

    const subtotal = this.cartService.getSubtotal(items);
    const total = subtotal + this.authenticationFee + this.shippingCost;

    const personal = this.form.controls.personal.getRawValue();
    const delivery = this.form.controls.delivery.getRawValue();
    const payment = this.form.controls.payment.getRawValue();

    const order: Order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items,
      customer: {
        fullName: personal.fullName ?? '',
        email: personal.email ?? '',
        phone: personal.phone ?? '',
      },
      delivery: {
        city: delivery.city ?? '',
        address: delivery.address ?? '',
        deliveryMethod: delivery.deliveryMethod ?? 'Express – Morocco',
      },
      payment: this.buildPaymentInfo(method, payment),
      totals: {
        subtotal,
        authenticationFee: this.authenticationFee,
        shipping: this.shippingCost,
        total,
      },
    };

    // MVP: simulate order submission (ready for future backend integration)
    console.log('ORDER_SUBMITTED', order);

    // Clear state after success.
    this.cartService.clear();
    this.checkoutService.clearPaymentMethod();

    this.message = 'Commande passée avec succès.';
    void this.router.navigateByUrl('/cart');
  }

  private applyPaymentValidators(method: PaymentMethod | null): void {
    const paymentGroup = this.form.controls.payment;

    const cardholderName = paymentGroup.controls.cardholderName;
    const cardNumber = paymentGroup.controls.cardNumber;
    const expiry = paymentGroup.controls.expiry;
    const cvv = paymentGroup.controls.cvv;
    const paypalEmail = paymentGroup.controls.paypalEmail;

    // Reset validators (MVP)
    cardholderName.clearValidators();
    cardNumber.clearValidators();
    expiry.clearValidators();
    cvv.clearValidators();
    paypalEmail.clearValidators();

    if (isCardMethod(method)) {
      cardholderName.setValidators([Validators.required]);
      // MVP: just length check (no Luhn)
      cardNumber.setValidators([Validators.required, Validators.minLength(12), Validators.maxLength(19)]);
      expiry.setValidators([Validators.required]);
      cvv.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(4)]);
    } else if (method === 'paypal') {
      paypalEmail.setValidators([Validators.required, Validators.email]);
    }

    cardholderName.updateValueAndValidity({ emitEvent: false });
    cardNumber.updateValueAndValidity({ emitEvent: false });
    expiry.updateValueAndValidity({ emitEvent: false });
    cvv.updateValueAndValidity({ emitEvent: false });
    paypalEmail.updateValueAndValidity({ emitEvent: false });
  }

  private buildForm(): CheckoutForm {
    const nn = this.fb.nonNullable;
    return nn.group({
      personal: nn.group({
        fullName: nn.control('', Validators.required),
        email: nn.control('', [Validators.required, Validators.email]),
        phone: nn.control('', Validators.required),
      }),
      delivery: nn.group({
        city: nn.control('', Validators.required),
        address: nn.control('', Validators.required),
        deliveryMethod: nn.control('Express – Morocco', Validators.required),
      }),
      payment: nn.group({
        cardholderName: nn.control(''),
        cardNumber: nn.control(''),
        expiry: nn.control(''),
        cvv: nn.control(''),
        paypalEmail: nn.control(''),
      }),
    });
  }

  private buildPaymentInfo(
    method: PaymentMethod,
    payment: {
      cardholderName: string | null;
      cardNumber: string | null;
      expiry: string | null;
      cvv: string | null;
      paypalEmail: string | null;
    }
  ): Order['payment'] {
    if (isCardMethod(method)) {
      return {
        method,
        cardholderName: payment.cardholderName ?? '',
        cardNumber: payment.cardNumber ?? '',
        expiry: payment.expiry ?? '',
        cvv: payment.cvv ?? '',
      };
    }

    if (method === 'paypal') {
      return {
        method,
        paypalEmail: payment.paypalEmail ?? '',
      };
    }

    if (method === 'google-pay') {
      return { method };
    }

    return { method: 'bank-transfer' };
  }
}

type CheckoutForm = FormGroup<{
  personal: FormGroup<{
    fullName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
  }>;
  delivery: FormGroup<{
    city: FormControl<string>;
    address: FormControl<string>;
    deliveryMethod: FormControl<string>;
  }>;
  payment: FormGroup<{
    cardholderName: FormControl<string>;
    cardNumber: FormControl<string>;
    expiry: FormControl<string>;
    cvv: FormControl<string>;
    paypalEmail: FormControl<string>;
  }>;
}>;

