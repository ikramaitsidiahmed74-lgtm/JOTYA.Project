import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService, Product } from '../../../services/product.service';

/**
 * SimilarProductsCarouselComponent
 * 
 * Auto-scrolling carousel for similar products with infinite loop marquee effect.
 * Products move from right to left continuously and pause on hover.
 * 
 * Usage:
 * <app-similar-products-carousel
 *   [categoryId]="product.category"
 *   [currentProductId]="product.id"
 *   [speed]="30"
 * ></app-similar-products-carousel>
 */
@Component({
  selector: 'app-similar-products-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './similar-products-carousel.component.html',
  styleUrls: ['./similar-products-carousel.component.scss']
})
export class SimilarProductsCarouselComponent implements OnInit, OnDestroy, AfterViewInit {
  
  // ==================== INPUTS ====================
  
  /** Category ID to fetch similar products */
  @Input() categoryId: string = '';
  
  /** Current product ID to exclude from similar products */
  @Input() currentProductId: number = 0;
  
  /** Animation speed in seconds (lower = faster) */
  @Input() speed: number = 30;
  
  /** Title of the section */
  @Input() title: string = 'Produits similaires';
  
  /** Subtitle of the section */
  @Input() subtitle: string = 'Découvrez d\'autres articles qui pourraient vous plaire';

  // ==================== STATE ====================
  
  /** Products to display in carousel */
  products: Product[] = [];
  
  /** Duplicated products for seamless infinite scroll */
  displayProducts: Product[] = [];
  
  /** Loading state */
  loading: boolean = true;
  
  /** Pause animation on hover */
  isPaused: boolean = false;

  // ==================== PRIVATE ====================
  
  private destroy$ = new Subject<void>();
  
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  // ==================== LIFECYCLE ====================

  ngOnInit(): void {
    this.loadSimilarProducts();
  }

  ngAfterViewInit(): void {
    // Animation is handled by CSS, no JS needed for basic marquee
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== DATA LOADING ====================

  /**
   * Load similar products from the ProductService
   * Excludes the current product and duplicates the array for infinite scroll
   */
  private loadSimilarProducts(): void {
    this.loading = true;
    
    // Get similar products (same category, excluding current product)
    const similar = this.productService.getSimilarProducts(this.currentProductId, 12);
    
    if (similar.length > 0) {
      this.products = similar;
      // Duplicate products for seamless infinite scroll effect
      // We need at least 2x the products to create the loop illusion
      this.displayProducts = [...similar, ...similar, ...similar];
    }
    
    this.loading = false;
  }

  // ==================== INTERACTION ====================

  /**
   * Navigate to product detail page
   */
  onProductClick(productId: number): void {
    this.router.navigate(['/products', productId]);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Pause animation on mouse enter
   */
  onMouseEnter(): void {
    this.isPaused = true;
  }

  /**
   * Resume animation on mouse leave
   */
  onMouseLeave(): void {
    this.isPaused = false;
  }

  // ==================== HELPERS ====================

  /**
   * TrackBy function for ngFor performance
   */
  trackByProduct(index: number, product: Product): string {
    return `${product.id}-${index}`;
  }

  /**
   * Format price with Moroccan locale
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Get animation duration based on number of products and speed
   * More products = longer animation to maintain consistent speed
   */
  get animationDuration(): string {
    const baseDuration = this.speed;
    const multiplier = Math.max(1, this.products.length / 4);
    return `${baseDuration * multiplier}s`;
  }

  /**
   * Get state badge class based on product state
   */
  getStateBadgeClass(state: string): string {
    switch (state) {
      case 'Neuf avec étiquette':
        return 'badge-new';
      case 'Excellent état':
        return 'badge-excellent';
      case 'Très bon état':
        return 'badge-good';
      default:
        return 'badge-default';
    }
  }
}
