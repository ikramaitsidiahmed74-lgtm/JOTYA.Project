import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Category, Product, ProductService } from '../../../services/product.service';
import { CATEGORY_ICON_DEFAULT } from '../../../shared/icons/category-icons';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';

@Component({
  selector: 'app-base-category',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './base-category.component.html',
  styleUrl: './base-category.component.css'
})
export class BaseCategoryComponent implements OnInit {
  @Input() categoryId: string = '';
  @Input() categoryLabel: string = '';
  @Input() categoryIcon: string = '';
  @Input() categoryIconSvg: string = '';
  @Input() categoryDescription: string = '';

  products: Product[] = [];
  categories: Category[] = [];
  safeIcons = new Map<string, SafeHtml>();
  safeCategoryIcon: SafeHtml;
  loading = true;
  resolvedCategoryId = '';

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {
    this.safeCategoryIcon = this.toSafeIcon();
  }

  ngOnInit(): void {
    this.resolvedCategoryId = this.productService.resolveCategoryId(this.categoryId);
    this.loadCategories();
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.products = this.productService.getProductsByCategory(this.resolvedCategoryId);
    this.loading = false;
  }

  private loadCategories(): void {
    this.categories = this.productService.getCategories();

    this.safeIcons = new Map(
      this.categories.map(category => [
        category.id,
        this.toSafeIcon(category.iconSvg || category.icon)
      ])
    );

    const activeIcon = this.categoryIconSvg
      || this.findCategoryIcon(this.resolvedCategoryId)
      || this.categoryIcon;
    this.safeCategoryIcon = this.toSafeIcon(activeIcon);
  }

  private findCategoryIcon(categoryId: string): string | undefined {
    const activeCategory = this.categories.find(
      category => this.productService.resolveCategoryId(category.id) === categoryId
    );
    return activeCategory?.iconSvg || activeCategory?.icon;
  }

  private toSafeIcon(markup?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(markup?.trim() || CATEGORY_ICON_DEFAULT);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  toggleFavorite(product: Product): void {
    product.isFavorite = !product.isFavorite;
  }

  addToCart(product: Product): void {
    console.log('Ajout au panier:', product.name);
  }

  openProductDetail(product: Product): void {
    console.log('Détail produit:', product.id);
  }
}
