# JOTYA Catalogue - Angular Component Architecture Guide

## Overview

This document outlines how to structure the JOTYA luxury catalogue as a modern Angular application using standalone components and reactive programming patterns.

---

## Component Tree Architecture

```
CatalogueComponent (Main Container)
│
├── HeaderComponent
│   ├── LogoComponent
│   ├── NavigationComponent
│   ├── SearchBarComponent
│   └── UserMenuComponent
│
├── CatalogueLayoutComponent
│   │
│   ├── FilterSidebarComponent
│   │   ├── CategoriesFilterComponent
│   │   ├── StateFilterComponent
│   │   └── PriceRangeSliderComponent
│   │
│   └── ProductsGridComponent
│       ├── ToolbarComponent
│       │   ├── ProductCountComponent
│       │   └── SortSelectorComponent
│       │
│       ├── ProductsCardsComponent
│       │   └── ProductCardComponent (repeating)
│       │       ├── ProductImageComponent
│       │       ├── ProductInfoComponent
│       │       ├── ProductBadgeComponent
│       │       └── ProductFavoriteButtonComponent
│       │
│       ├── LoadMoreButtonComponent
│       └── PaginationComponent
│
└── FooterComponent
    ├── FooterLinksComponent (repeating)
    ├── FooterLogoComponent
    └── NewsletterFormComponent
```

---

## Detailed Component Specifications

### 1. **HeaderComponent** (Presentational)

**Location**: `src/app/components/header/header.component.ts`

**Inputs**: None

**Outputs**: 
- `menuItemClick: EventEmitter<string>` - Navigation menu clicks
- `searchSubmit: EventEmitter<string>` - Search query submissions
- `favoriteClick: EventEmitter<void>`
- `cartClick: EventEmitter<void>`

**Template Sections**:
- Logo/Branding
- Navigation menu (responsive)
- Search bar with icons
- User action icons (favorites, cart, profile)
- Mobile hamburger menu toggle

**Key Features**:
- Sticky positioning
- Responsive menu (hidden on mobile, visible on desktop)
- Search input with debounce
- Accessible ARIA labels

**Dependencies**: None

---

### 2. **CatalogueComponent** (Smart/Container)

**Location**: `src/app/catalogue/catalogue.component.ts`

**Inputs**: None

**Outputs**: None

**Responsibilities**:
- Manages filter state (categories, states, price)
- Manages products data (fetching, sorting, pagination)
- Coordinates between FilterSidebar and ProductsGrid
- Handles route parameters (category, page, filters)
- Manages BehaviorSubjects for reactive updates

**Key Observables**:
```typescript
filteredProducts$: Observable<Product[]>
displayedProducts$: Observable<Product[]>
isLoading$: Observable<boolean>
filters$: Observable<FilterState>
pagination$: Observable<PaginationState>
```

**Methods**:
```typescript
applyFilters(filters: FilterState): void
sortProducts(sortOption: SortOption): void
goToPage(pageNumber: number): void
loadMore(): void
resetFilters(): void
```

**Dependencies**:
- `ProductService` - Data fetching and filtering
- `ActivatedRoute` - Route parameters
- `Router` - Navigation

---

### 3. **FilterSidebarComponent** (Presentational)

**Location**: `src/app/components/filters/sidebar/filter-sidebar.component.ts`

**Inputs**:
```typescript
@Input() filters: FilterState
@Input() categories: Category[]
@Input() selectedCategory: string | null
```

**Outputs**:
```typescript
@Output() filterChange = new EventEmitter<FilterState>()
@Output() resetClick = new EventEmitter<void>()
@Output() categorySelect = new EventEmitter<string>()
```

**Sub-Components**:
- **CategoriesFilterComponent**
  - List of categories with counts
  - Active state styling
  - Click handlers

- **StateFilterComponent**
  - Checkboxes for product conditions
  - Multi-select capability

- **PriceRangeSliderComponent**
  - Range slider (min/max)
  - Input fields for manual entry
  - Validation and constraints

**Styling**: 
- Sticky positioning on desktop
- Hidden on tablet/mobile (drawer instead)
- BEM naming convention

---

### 4. **ProductCardComponent** (Presentational)

**Location**: `src/app/components/product/product-card.component.ts`

**Inputs**:
```typescript
@Input() product!: Product
@Input() isLoading = false
@Input() isFavorited = false
@Input() cardStyle: 'default' | 'mint' | 'cream' = 'default'
```

**Outputs**:
```typescript
@Output() cardClick = new EventEmitter<Product>()
@Output() favoriteClick = new EventEmitter<Product>()
@Output() addToCartClick = new EventEmitter<Product>()
```

**Template Structure**:
```
<article class="product-card">
  <div class="product-card__image-container">
    <img [src]="product.imageUrl" [alt]="product.name">
    <span class="product-card__tag">{{ product.tag }}</span>
    <button class="product-card__favorite">...</button>
  </div>
  <div class="product-card__content">
    <p class="product-card__category">{{ product.category }}</p>
    <h3 class="product-card__title">{{ product.name }}</h3>
    <div class="product-card__footer">
      <p class="product-card__price">{{ product.price | currency }}</p>
      <span class="product-card__state">{{ product.state }}</span>
    </div>
  </div>
</article>
```

**Features**:
- Lazy loading for images
- Hover effects
- Skeleton loading state
- Responsive image handling
- Accessibility: alt text, ARIA labels

**Styling Classes** (BEM):
- `.product-card`
- `.product-card__image-container`
- `.product-card__tag`
- `.product-card__favorite`
- `.product-card__content`
- `.product-card__category`
- `.product-card__title`
- `.product-card__price`
- `.product-card__state`

---

### 5. **ProductsGridComponent** (Presentational)

**Location**: `src/app/components/product/products-grid.component.ts`

**Inputs**:
```typescript
@Input() products: Product[] = []
@Input() isLoading = false
@Input() totalPages = 1
@Input() currentPage = 1
@Input() sortOptions: SortOption[]
```

**Outputs**:
```typescript
@Output() pageChange = new EventEmitter<number>()
@Output() sortChange = new EventEmitter<SortOption>()
@Output() productClick = new EventEmitter<Product>()
@Output() favoriteClick = new EventEmitter<Product>()
```

**Sub-Components**:
- **ToolbarComponent**: Sort dropdown, product count
- **ProductCardComponent** (repeated)
- **LoadMoreButtonComponent**
- **PaginationComponent**

**Responsive Layout**:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

---

### 6. **ToolbarComponent** (Presentational)

**Location**: `src/app/components/toolbar/toolbar.component.ts`

**Inputs**:
```typescript
@Input() productCount = 0
@Input() selectedSort = 'newest'
@Input() sortOptions: SortOption[] = []
```

**Outputs**:
```typescript
@Output() sortSelect = new EventEmitter<SortOption>()
@Output() viewChange = new EventEmitter<'grid' | 'list'>()
```

**Template**:
```
<div class="toolbar">
  <div class="toolbar__left">
    <p>Affichage de <strong>{{ productCount }}</strong> articles...</p>
  </div>
  <div class="toolbar__right">
    <select [(ngModel)]="selectedSort" (change)="onSortChange()">
      <option *ngFor="let option of sortOptions" [value]="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</div>
```

---

### 7. **PaginationComponent** (Presentational)

**Location**: `src/app/components/pagination/pagination.component.ts`

**Inputs**:
```typescript
@Input() currentPage = 1
@Input() totalPages = 1
@Input() maxVisiblePages = 5
```

**Outputs**:
```typescript
@Output() pageSelect = new EventEmitter<number>()
```

**Features**:
- Displays page numbers with ellipsis
- First/last page shortcuts
- Disabled state for edge cases
- Accessibility: ARIA labels

---

### 8. **FooterComponent** (Presentational)

**Location**: `src/app/components/footer/footer.component.ts`

**Inputs**:
```typescript
@Input() socialLinks: SocialLink[]
@Input() footerColumns: FooterColumn[]
```

**Outputs**:
```typescript
@Output() newsletterSubmit = new EventEmitter<string>()
```

**Sub-Components**:
- **FooterLinksComponent** (repeating for each column)
- **NewsletterFormComponent**

**Sections**:
1. Logo + Description
2. Platform Links (4 columns)
3. Newsletter signup
4. Copyright & Legal

---

## Data Models & Interfaces

### FilterState
```typescript
interface FilterState {
  categories: string[]
  states: ProductState[]
  priceRange: {
    min: number
    max: number
  }
}
```

### Product
```typescript
interface Product {
  id: string
  name: string
  imageUrl: string
  category: string
  price: number
  currency: string
  state: ProductState
  isFavorited: boolean
  tag?: string
  rating?: number
  verified?: boolean
}
```

### Category
```typescript
interface Category {
  id: string
  label: string
  icon: string
  count: number
}
```

### PaginationState
```typescript
interface PaginationState {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}
```

---

## Service Architecture

### ProductService
```typescript
// Location: src/app/services/product.service.ts

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>([])
  private categories$ = new BehaviorSubject<Category[]>([])
  
  constructor(private http: HttpClient) {
    this.loadProducts()
  }
  
  getProducts(): Observable<Product[]> { ... }
  getCategories(): Observable<Category[]> { ... }
  filterProducts(filters: FilterState): Observable<Product[]> { ... }
  searchProducts(query: string): Observable<Product[]> { ... }
  addFavorite(productId: string): Observable<void> { ... }
  removeFavorite(productId: string): Observable<void> { ... }
}
```

### FilterService
```typescript
// Location: src/app/services/filter.service.ts

@Injectable({ providedIn: 'root' })
export class FilterService {
  private filters$ = new BehaviorSubject<FilterState>(defaultFilters)
  
  filters = this.filters$.asObservable()
  
  updateFilters(filters: FilterState): void { ... }
  resetFilters(): void { ... }
  getActiveFiltersCount(): number { ... }
}
```

---

## State Management Pattern

### Using BehaviorSubjects

```typescript
// In CatalogueComponent

export class CatalogueComponent implements OnInit {
  private filterSubject = new BehaviorSubject<FilterState>(defaultFilters)
  filters$ = this.filterSubject.asObservable()
  
  filteredProducts$ = this.filters$.pipe(
    switchMap(filters => this.productService.filterProducts(filters)),
    shareReplay(1)
  )
  
  displayedProducts$ = combineLatest([
    this.filteredProducts$,
    this.paginationSubject.asObservable()
  ]).pipe(
    map(([products, pagination]) => {
      const start = (pagination.page - 1) * pagination.itemsPerPage
      return products.slice(start, start + pagination.itemsPerPage)
    })
  )
  
  applyFilters(filters: FilterState): void {
    this.filterSubject.next(filters)
  }
}
```

---

## Routing Structure

```typescript
// src/app/app.routes.ts

export const routes: Routes = [
  {
    path: 'catalogue-luxe',
    component: CatalogueComponent,
    data: { title: 'Catalogue Luxe' }
  },
  {
    path: 'catalogue-luxe/:category',
    component: CatalogueComponent,
    data: { title: 'Catalogue Luxe' }
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent
  }
]
```

---

## File Structure

```
src/
├── app/
│   ├── catalogue/
│   │   ├── catalogue.component.ts
│   │   ├── catalogue.component.html
│   │   └── catalogue.component.css
│   │
│   ├── components/
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   └── header.component.css
│   │   │
│   │   ├── filters/
│   │   │   ├── sidebar/
│   │   │   │   ├── filter-sidebar.component.ts
│   │   │   │   ├── filter-sidebar.component.html
│   │   │   │   └── filter-sidebar.component.css
│   │   │   ├── categories/
│   │   │   │   ├── categories-filter.component.ts
│   │   │   │   ├── categories-filter.component.html
│   │   │   │   └── categories-filter.component.css
│   │   │   ├── state/
│   │   │   │   ├── state-filter.component.ts
│   │   │   │   ├── state-filter.component.html
│   │   │   │   └── state-filter.component.css
│   │   │   └── price-range/
│   │   │       ├── price-range-slider.component.ts
│   │   │       ├── price-range-slider.component.html
│   │   │       └── price-range-slider.component.css
│   │   │
│   │   ├── product/
│   │   │   ├── product-card.component.ts
│   │   │   ├── product-card.component.html
│   │   │   ├── product-card.component.css
│   │   │   ├── products-grid.component.ts
│   │   │   ├── products-grid.component.html
│   │   │   └── products-grid.component.css
│   │   │
│   │   ├── toolbar/
│   │   │   ├── toolbar.component.ts
│   │   │   ├── toolbar.component.html
│   │   │   └── toolbar.component.css
│   │   │
│   │   ├── pagination/
│   │   │   ├── pagination.component.ts
│   │   │   ├── pagination.component.html
│   │   │   └── pagination.component.css
│   │   │
│   │   └── footer/
│   │       ├── footer.component.ts
│   │       ├── footer.component.html
│   │       └── footer.component.css
│   │
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── filter.service.ts
│   │   └── favorites.service.ts
│   │
│   ├── models/
│   │   ├── product.model.ts
│   │   ├── filter.model.ts
│   │   └── category.model.ts
│   │
│   └── styles/
│       ├── variables.css
│       ├── typography.css
│       ├── buttons.css
│       ├── forms.css
│       └── utilities.css
```

---

## Best Practices & Patterns

### 1. **Standalone Components**
```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent { ... }
```

### 2. **OnPush Change Detection**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
```

### 3. **RxJS Operators**
- `switchMap` - For dependent observables
- `combineLatest` - For multiple filter changes
- `debounceTime` - For search input
- `distinctUntilChanged` - Prevent duplicate requests
- `shareReplay` - Cache results

### 4. **Unsubscribe Pattern**
```typescript
private destroy$ = new Subject<void>()

ngOnInit() {
  this.products$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(...)
}

ngOnDestroy() {
  this.destroy$.next()
  this.destroy$.complete()
}
```

### 5. **Template Syntax**
```html
<!-- Use async pipe -->
<div *ngIf="isLoading$ | async as isLoading">
  <p>{{ isLoading ? 'Loading...' : 'Ready' }}</p>
</div>

<!-- Use trackBy for lists -->
<div *ngFor="let product of products$ | async; trackBy: trackByProductId">
  <app-product-card [product]="product"></app-product-card>
</div>
```

### 6. **Event Handling**
```typescript
// Use Output EventEmitter
@Output() productSelect = new EventEmitter<Product>()

onCardClick(product: Product) {
  this.productSelect.emit(product)
}
```

---

## Performance Optimizations

### 1. **Image Lazy Loading**
```html
<img 
  [src]="product.imageUrl" 
  loading="lazy"
  [ngSrc]="product.imageUrl"
>
```

### 2. **Virtual Scrolling** (for large lists)
```typescript
import { ScrollingModule } from '@angular/cdk/scrolling'

<cdk-virtual-scroll-viewport itemSize="300">
  <app-product-card *cdkVirtualFor="let product of products$"></app-product-card>
</cdk-virtual-scroll-viewport>
```

### 3. **Code Splitting**
```typescript
const catalogueRoutes = [
  { path: 'catalogue-luxe', loadComponent: () => 
    import('./catalogue/catalogue.component').then(m => m.CatalogueComponent)
  }
]
```

### 4. **OnPush Change Detection**
Use `ChangeDetectionStrategy.OnPush` on presentational components for better performance.

---

## Testing Strategy

### Unit Tests (Jasmine/Karma)
```typescript
describe('ProductCardComponent', () => {
  it('should emit cardClick on click', () => {
    const product = { id: '1', name: 'Test' }
    component.product = product
    spyOn(component.cardClick, 'emit')
    
    component.onCardClick()
    
    expect(component.cardClick.emit).toHaveBeenCalledWith(product)
  })
})
```

### E2E Tests (Cypress/Playwright)
```typescript
describe('Catalogue Page', () => {
  it('should filter products by category', () => {
    cy.visit('/catalogue-luxe')
    cy.contains('Vêtements').click()
    cy.get('[data-test="product-card"]').should('have.length', 10)
  })
})
```

---

## Accessibility Checklist

- [ ] Semantic HTML (nav, main, section, article, footer)
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast ratio 4.5:1 minimum
- [ ] Alt text on all images
- [ ] Form labels associated with inputs
- [ ] Skip links for main content
- [ ] Test with screen readers (NVDA, VoiceOver)

---

## Deployment & Build

### Production Build
```bash
ng build --configuration production --optimization --aot
```

### Performance Budget
- Bundle size: < 500KB (gzipped)
- First Contentful Paint: < 2s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 85

---

## References & Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Performance Guide](https://angular.io/guide/performance-best-practices)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
