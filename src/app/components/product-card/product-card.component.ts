import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-52 cursor-pointer group">
      <!-- Image Container -->
      <div class="relative bg-[#f3f3f3] dark:bg-[#1f1f1f] aspect-[3/4] overflow-hidden">
        <img
          [src]="product.image"
          [alt]="product.name"
          class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        
        <!-- Plus Button -->
        <button
          class="absolute bottom-3 left-3 w-9 h-9 bg-white dark:bg-[#ffed00] text-black text-lg font-light flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          (click)="onAddToCart($event)"
        >
          +
        </button>
      </div>

      <!-- Product Info -->
      <div class="mt-4">
        <p class="text-xs uppercase tracking-[0.15em] text-gray-700 dark:text-gray-400 font-light leading-tight">
          {{ product.name }}
        </p>
        <span class="text-sm font-semibold text-black dark:text-white mt-2 block">
          {{ product.price }} MAD
        </span>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product!: any;

  onAddToCart(event: Event): void {
    event.preventDefault();
    console.log('Added to cart:', this.product);
  }
}
