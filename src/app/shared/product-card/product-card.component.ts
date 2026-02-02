import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
  @Input() loading = false;
  @Input() showFavorite = true;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() favoriteToggle = new EventEmitter<Product>();
  @Output() viewDetail = new EventEmitter<Product>();

  constructor(private router: Router) {}

  get hasData(): boolean {
    return !!this.product && !this.loading;
  }

  onCardClick(): void {
    if (this.product) {
      this.router.navigate(['/products', this.product.id]);
      this.viewDetail.emit(this.product);
    }
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    if (this.product) {
      this.favoriteToggle.emit(this.product);
    }
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }
}
