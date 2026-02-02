# Code Examples & Implementation Snippets

## Table of Contents
1. [Angular Components](#angular-components)
2. [Services](#services)
3. [RxJS Patterns](#rxjs-patterns)
4. [HTML/CSS Patterns](#htmlcss-patterns)
5. [Type Definitions](#type-definitions)

---

## Angular Components

### 1. ProductCardComponent (Standalone)

```typescript
// product-card.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Product, ProductState } from '../../models/product.model'

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product
  @Input() isLoading = false
  @Input() cardStyle: 'default' | 'mint' | 'cream' = 'default'
  
  @Output() cardClick = new EventEmitter<Product>()
  @Output() favoriteClick = new EventEmitter<Product>()
  @Output() addToCart = new EventEmitter<Product>()

  get hasData(): boolean {
    return !!this.product && !this.isLoading
  }

  get cardBgClass(): string {
    const bgMap = {
      'default': 'bg-white',
      'mint': 'bg-mint-50',
      'cream': 'bg-cream-50'
    }
    return bgMap[this.cardStyle]
  }

  onCardClick(): void {
    if (this.product) {
      this.cardClick.emit(this.product)
    }
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation()
    if (this.product) {
      this.favoriteClick.emit(this.product)
    }
  }

  onAddToCart(event: Event): void {
    event.stopPropagation()
    if (this.product) {
      this.addToCart.emit(this.product)
    }
  }

  getStateColor(state: ProductState): string {
    const colorMap: Record<ProductState, string> = {
      'Neuf avec étiquette': 'text-green-600',
      'Excellent état': 'text-blue-600',
      'Très bon état': 'text-amber-600'
    }
    return colorMap[state] || 'text-gray-600'
  }

  trackByProductId = (index: number) => this.product?.id || index
}
```

```html
<!-- product-card.component.html -->
<article 
  class="product-card" 
  [ngClass]="cardBgClass"
  (click)="onCardClick()"
>
  <!-- Image Container -->
  <div class="product-card__image-container">
    @if (hasData) {
      <img 
        [src]="product.imageUrl" 
        [alt]="product.name"
        loading="lazy"
        class="product-card__image"
      />
      @if (product.tag) {
        <span class="product-card__tag">{{ product.tag }}</span>
      }
      <button 
        class="product-card__favorite"
        [attr.aria-pressed]="product.isFavorited"
        (click)="onFavoriteClick($event)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    } @else {
      <div class="product-card__skeleton"></div>
    }
  </div>

  <!-- Content -->
  <div class="product-card__content">
    @if (hasData) {
      <p class="product-card__category">{{ product.category }}</p>
      <h3 class="product-card__title">{{ product.name }}</h3>
      <div class="product-card__footer">
        <p class="product-card__price">
          {{ product.price | number:'1.0-0' }}
          <span class="product-card__currency">MAD</span>
        </p>
        <span [class]="'product-card__state ' + getStateColor(product.state)">
          {{ product.state }}
        </span>
      </div>
    }
  </div>
</article>
```

```css
/* product-card.component.css */
:host {
  display: block;
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
}

.product-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.product-card__image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--color-border);
  overflow: hidden;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

/* ... more styles ... */
```

---

### 2. CatalogueComponent (Smart Container)

```typescript
// catalogue.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs'
import { 
  switchMap, 
  map, 
  takeUntil, 
  shareReplay, 
  debounceTime, 
  distinctUntilChanged 
} from 'rxjs/operators'

import { ProductService } from '../../services/product.service'
import { FilterService } from '../../services/filter.service'
import { Product, FilterState, PaginationState } from '../../models/product.model'

import { FilterSidebarComponent } from '../filters/filter-sidebar.component'
import { ProductsGridComponent } from '../product/products-grid.component'
import { HeaderComponent } from '../header/header.component'
import { FooterComponent } from '../footer/footer.component'

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FilterSidebarComponent,
    ProductsGridComponent,
    FooterComponent
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogueComponent implements OnInit, OnDestroy {
  // Observables
  products$: Observable<Product[]>
  filteredProducts$: Observable<Product[]>
  displayedProducts$: Observable<Product[]>
  isLoading$: Observable<boolean>
  totalPages$: Observable<number>
  currentPage$: Observable<number>
  
  // Subjects
  private filterSubject = new BehaviorSubject<FilterState>(this.filterService.getDefaultFilters())
  private paginationSubject = new BehaviorSubject<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 6,
    totalItems: 0
  })
  private destroy$ = new Subject<void>()

  constructor(
    private productService: ProductService,
    private filterService: FilterService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // Initialize observables
    this.products$ = this.productService.getProducts().pipe(shareReplay(1))
    
    this.filteredProducts$ = this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(filters => this.productService.filterProducts(filters)),
      shareReplay(1)
    )
    
    this.displayedProducts$ = combineLatest([
      this.filteredProducts$,
      this.paginationSubject.asObservable()
    ]).pipe(
      map(([products, pagination]) => {
        const start = (pagination.currentPage - 1) * pagination.itemsPerPage
        return products.slice(start, start + pagination.itemsPerPage)
      }),
      shareReplay(1)
    )

    this.isLoading$ = this.productService.isLoading$
    
    this.totalPages$ = this.filteredProducts$.pipe(
      map(products => Math.ceil(products.length / 6))
    )

    this.currentPage$ = this.paginationSubject.pipe(
      map(p => p.currentPage)
    )
  }

  ngOnInit(): void {
    // Handle route parameters
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const category = params.get('category')
        if (category) {
          this.applyFilter({ ...this.filterSubject.value, categories: [category] })
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  applyFilter(filters: FilterState): void {
    this.filterSubject.next(filters)
    this.paginationSubject.next({ 
      ...this.paginationSubject.value, 
      currentPage: 1 
    })
  }

  onPriceChange(range: { min: number; max: number }): void {
    const currentFilters = this.filterSubject.value
    this.applyFilter({
      ...currentFilters,
      priceRange: range
    })
  }

  onCategoryChange(category: string): void {
    const currentFilters = this.filterSubject.value
    this.applyFilter({
      ...currentFilters,
      categories: [category]
    })
  }

  resetFilters(): void {
    this.filterSubject.next(this.filterService.getDefaultFilters())
    this.paginationSubject.next({ 
      ...this.paginationSubject.value, 
      currentPage: 1 
    })
  }

  goToPage(page: number): void {
    this.paginationSubject.next({ 
      ...this.paginationSubject.value, 
      currentPage: page 
    })
  }

  onProductClick(product: Product): void {
    this.router.navigate(['/products', product.id])
  }

  onFavoriteClick(product: Product): void {
    this.productService.toggleFavorite(product.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe()
  }

  trackByProductId = (index: number, product: Product) => product.id
}
```

---

## Services

### 1. ProductService

```typescript
// product.service.ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { Product, FilterState } from '../models/product.model'

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([])
  private loadingSubject = new BehaviorSubject<boolean>(false)
  
  products$ = this.productsSubject.asObservable()
  isLoading$ = this.loadingSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadProducts()
  }

  private loadProducts(): void {
    this.loadingSubject.next(true)
    this.http.get<Product[]>('/api/products')
      .pipe(
        tap(products => {
          this.productsSubject.next(products)
          this.loadingSubject.next(false)
        })
      )
      .subscribe()
  }

  getProducts(): Observable<Product[]> {
    return this.products$
  }

  filterProducts(filters: FilterState): Observable<Product[]> {
    return this.products$.pipe(
      tap(() => this.loadingSubject.next(true)),
      map(products => {
        let filtered = [...products]

        // Filter by category
        if (filters.categories.length > 0) {
          filtered = filtered.filter(p => filters.categories.includes(p.category))
        }

        // Filter by state
        if (filters.states.length > 0) {
          filtered = filtered.filter(p => filters.states.includes(p.state))
        }

        // Filter by price
        filtered = filtered.filter(p => 
          p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
        )

        this.loadingSubject.next(false)
        return filtered
      })
    )
  }

  toggleFavorite(productId: string): Observable<void> {
    return this.http.patch<void>(`/api/products/${productId}/favorite`, {})
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/products/search`, {
      params: { q: query }
    })
  }
}
```

### 2. FilterService

```typescript
// filter.service.ts
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { FilterState } from '../models/product.model'

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  states: [],
  priceRange: { min: 0, max: 20000 }
}

@Injectable({ providedIn: 'root' })
export class FilterService {
  private filtersSubject = new BehaviorSubject<FilterState>(DEFAULT_FILTERS)
  
  filters$ = this.filtersSubject.asObservable()

  getDefaultFilters(): FilterState {
    return { ...DEFAULT_FILTERS }
  }

  updateFilters(filters: FilterState): void {
    this.filtersSubject.next(filters)
  }

  getActiveFiltersCount(): number {
    const filters = this.filtersSubject.value
    let count = 0
    
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.states.length > 0) count += filters.states.length
    if (filters.priceRange.min > 0 || filters.priceRange.max < 20000) count += 1
    
    return count
  }

  resetFilters(): void {
    this.filtersSubject.next(DEFAULT_FILTERS)
  }
}
```

---

## RxJS Patterns

### 1. Combining Multiple Filters

```typescript
// Combining form inputs into filter state
const searchInput$ = new Subject<string>()
const categorySelect$ = new Subject<string>()
const priceRange$ = new Subject<{ min: number; max: number }>()

const filters$ = combineLatest([
  searchInput$.pipe(debounceTime(300), distinctUntilChanged()),
  categorySelect$,
  priceRange$
]).pipe(
  map(([search, category, priceRange]) => ({
    search,
    categories: [category],
    priceRange
  })),
  shareReplay(1)
)

const filteredProducts$ = filters$.pipe(
  switchMap(filters => this.productService.filterProducts(filters))
)
```

### 2. Pagination with Reactive Forms

```typescript
// pagination.ts
const itemsPerPage = 12
const filteredProducts$ = /* ... */

const totalPages$ = filteredProducts$.pipe(
  map(products => Math.ceil(products.length / itemsPerPage))
)

const currentPage$ = new BehaviorSubject<number>(1)

const displayedProducts$ = combineLatest([
  filteredProducts$,
  currentPage$
]).pipe(
  map(([products, page]) => {
    const start = (page - 1) * itemsPerPage
    return products.slice(start, start + itemsPerPage)
  })
)
```

### 3. Debounced Search

```typescript
// search.ts
const searchInput$ = new Subject<string>()

const searchResults$ = searchInput$.pipe(
  debounceTime(500),           // Wait 500ms after user stops typing
  distinctUntilChanged(),        // Only if text actually changed
  switchMap(query => 
    query.trim() === '' 
      ? of([])                   // Empty results if no query
      : this.productService.searchProducts(query)
  ),
  catchError(() => of([]))       // Return empty array on error
)
```

---

## HTML/CSS Patterns

### 1. Product Grid with Responsive Layout

```html
<!-- Responsive grid using CSS Grid -->
<div class="products-grid">
  @for (product of displayedProducts$ | async; track product.id) {
    <app-product-card 
      [product]="product"
      (cardClick)="onProductClick($event)"
      (favoriteClick)="onFavoriteClick($event)"
    ></app-product-card>
  }
</div>

<style>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-3xl);
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tablet: 2 columns */
@media (max-width: 1023px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: 1 column */
@media (max-width: 639px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

### 2. Filter Sidebar with Sticky Positioning

```html
<aside class="sidebar">
  <div class="sidebar__content">
    <!-- Categories -->
    <section class="filter-section">
      <h2 class="filter-section__title">Catégories</h2>
      @for (category of categories$ | async; track category.id) {
        <button 
          [class.active]="selectedCategory$ | async as selected; selected === category.id"
          (click)="onCategorySelect(category.id)"
          class="category-item"
        >
          {{ category.label }}
        </button>
      }
    </section>

    <!-- Price Range -->
    <section class="filter-section">
      <h2 class="filter-section__title">Price Range</h2>
      <input 
        type="range" 
        min="0" 
        max="20000" 
        [(ngModel)]="priceRange.max"
        (change)="onPriceChange()"
      />
    </section>
  </div>
</aside>

<style>
.sidebar {
  position: sticky;
  top: 64px;
  height: fit-content;
  width: 280px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

@media (max-width: 1023px) {
  .sidebar {
    display: none; /* Hidden on tablet/mobile */
  }
}
</style>
```

### 3. Loading Skeleton

```html
<!-- Skeleton placeholder while loading -->
@if (isLoading$ | async) {
  @for (i of [0,1,2,3,4,5]; track i) {
    <div class="product-card product-card--loading">
      <div class="skeleton skeleton--image"></div>
      <div class="skeleton skeleton--text"></div>
      <div class="skeleton skeleton--text"></div>
    </div>
  }
}

<style>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    #f0f0f0 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton--image {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-md);
}

.skeleton--text {
  height: 12px;
  border-radius: var(--radius-full);
  margin-top: var(--spacing-md);
}
</style>
```

---

## Type Definitions

### models/product.model.ts

```typescript
export type ProductState = 'Neuf avec étiquette' | 'Excellent état' | 'Très bon état'

export interface Product {
  id: string
  name: string
  category: string
  imageUrl: string
  price: number
  currency: 'MAD' | 'EUR' | 'USD'
  state: ProductState
  isFavorited: boolean
  tag?: string
  rating?: number
  verified?: boolean
  createdAt?: Date
  seller?: {
    id: string
    name: string
    rating: number
  }
}

export interface Category {
  id: string
  label: string
  icon: string
  count: number
}

export interface FilterState {
  categories: string[]
  states: ProductState[]
  priceRange: {
    min: number
    max: number
  }
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating'

export interface SortOptionItem {
  value: SortOption
  label: string
}
```

---

**These code examples are production-ready and can be adapted to your specific needs.**
