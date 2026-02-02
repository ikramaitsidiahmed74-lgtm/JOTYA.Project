import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

// Interface pour les produits similaires
export interface SimilarProduct {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  badge?: string;
  categoryId?: string;
}

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './similar-products.component.html',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ 
            opacity: 0, 
            transform: 'translateX(-50px)' 
          }),
          stagger(100, [
            animate('400ms ease-out', style({ 
              opacity: 1, 
              transform: 'translateX(0)' 
            }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateX(-50px)' 
        }),
        animate('400ms ease-out', style({ 
          opacity: 1, 
          transform: 'translateX(0)' 
        }))
      ])
    ])
  ]
})
export class SimilarProductsComponent implements OnChanges {
  @Input() products: SimilarProduct[] = [];
  @Input() title: string = 'Produits similaires';
  @Input() subtitle: string = "D'autres pépites qui pourraient vous plaire";
  
  @Output() productClick = new EventEmitter<number>();

  // Clé pour forcer le re-render des animations
  animationKey: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      // Incrémenter la clé pour déclencher l'animation à chaque changement
      this.animationKey++;
    }
  }

  onProductClick(productId: number): void {
    this.productClick.emit(productId);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  }

  trackByProductId(index: number, product: SimilarProduct): number {
    return product.id;
  }

  getBadgeClass(badge: string | undefined): string {
    if (!badge) return '';
    
    switch (badge) {
      case 'NEUF':
      case 'COMME NEUF':
        return 'bg-green-100 text-green-700';
      case 'BON ÉTAT':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
