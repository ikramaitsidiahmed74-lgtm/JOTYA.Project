# CATALOG COMPONENT - IMPLEMENTATION REFERENCE

This file contains exact code examples for common issues and their fixes.

## Issue 1: Adding Debug Logging to Catalog Component

**File:** `src/app/catalogue-luxe/catalogue-luxe.component.ts`

### Current Code (Line 83-120)
```typescript
ngOnInit(): void {
  // Charger les données de base
  this.products = this.productService.getProducts();
  this.categories = this.productService.getCategories();
  this.buildCategoryIcons();

  console.log('✅ Produits chargés:', this.products.length);
  console.log('✅ Catégories chargées:', this.categories.length);

  // Initialiser avec tous les produits si aucune donnée
  if (this.products.length > 0 && this.displayedProducts.length === 0) {
    this.displayedProducts = this.products.slice(0, 6);
    console.log('🔄 Initialisation avec 6 premiers produits');
  }

  // S'abonner aux changements de paramètre de route
  this.activatedRoute.paramMap
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      const categoryParam = params.get('category');
      console.log('📍 Paramètre catégorie route:', categoryParam);
      this.onCategoryRouteChange(categoryParam);
    });
}
```

### Enhanced With More Debug Info
```typescript
ngOnInit(): void {
  // Charger les données de base
  this.products = this.productService.getProducts();
  this.categories = this.productService.getCategories();
  this.buildCategoryIcons();

  console.log('✅ Produits chargés:', this.products.length);
  console.log('✅ Catégories chargées:', this.categories.length);

  // NEW: Log first few products
  if (this.products.length > 0) {
    console.log('📊 Premiers produits:');
    this.products.slice(0, 3).forEach(p => {
      console.log(`  - ${p.name} (${p.category}): ${p.price}MAD, Image: ${p.imageUrl}`);
    });
  }

  // NEW: Log category counts
  console.log('📂 Catégories avec compteurs:');
  this.categories.forEach(cat => {
    console.log(`  - ${cat.label}: ${cat.count} produits`);
  });

  // Initialiser avec tous les produits si aucune donnée
  if (this.products.length > 0 && this.displayedProducts.length === 0) {
    this.displayedProducts = this.products.slice(0, 6);
    console.log('🔄 Initialisation avec 6 premiers produits');
  }

  // S'abonner aux changements de paramètre de route
  this.activatedRoute.paramMap
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      const categoryParam = params.get('category');
      console.log('📍 Paramètre catégorie route:', categoryParam);
      this.onCategoryRouteChange(categoryParam);
    });
}
```

---

## Issue 2: Fixing Empty Image Arrays in Service

**File:** `src/app/services/product.service.ts`

### Problem Code
```typescript
vetements: {
  folder: 'assets/vetements',
  images: [
    // Images list missing or incomplete!
  ],
  defaultPrice: 199,
  categoryName: 'Vêtements'
},
```

### Fixed Code (Line 45-71)
```typescript
vetements: {
  folder: 'assets/vetements',
  images: [
    '07878532805-e2.jpg',
    'd9a97503-da9f-4e98-b957-3bc5ccf819e0.jpeg',
    'JUPE1.PNG',
    'V1.jpg',
    'V10.PNG',
    'V11.PNG',
    'v17.PNG',
    'V2.jpg',
    'V3.jpg',
    'V4.PNG',
    'V5.PNG',
    'V6.PNG',
    'V7.PNG',
    'V8.PNG',
    'V9.PNG',
    'vet jacket.PNG',
    'vet pantalon.PNG',
    'vete jk.PNG',
    'vetemt ik.PNG',
    'vetik.PNG',
    'VT2.PNG',
    'VT21.PNG',
    'VT22.PNG',
    'VT23.PNG',
    'VT28.PNG',
    'VT35.PNG'
  ],
  defaultPrice: 199,
  categoryName: 'Vêtements'
},
```

---

## Issue 3: Fixing Missing Categories in Service

**File:** `src/app/services/product.service.ts`

### How to Add a New Category

```typescript
// In product.service.ts, in private readonly categories

private readonly categories: Category[] = [
  { id: 'vetements', label: 'Vêtements', iconSvg: CATEGORY_ICON_SVGS['vetements'], icon: '👔' },
  { id: 'accessoires', label: 'Accessoires', iconSvg: CATEGORY_ICON_SVGS['accessoires'], icon: '👜' },
  { id: 'electronique', label: 'Électronique', iconSvg: CATEGORY_ICON_SVGS['electronique'], icon: '📱' },
  { id: 'chaussures', label: 'Chaussures', iconSvg: CATEGORY_ICON_SVGS['chaussures'], icon: '👟' },
  { id: 'lunettes', label: 'Lunettes', iconSvg: CATEGORY_ICON_SVGS['lunettes'], icon: '🕶️' },
  { id: 'pieces-uniques', label: 'Pièces Uniques', icon: '✨' },
  { id: 'maison', label: 'Maison', icon: '🏠' },
  { id: 'marques', label: 'Marques', icon: '⭐' },
  { id: 'velo', label: 'Vélo', icon: '🚲' },
  { id: 'construction', label: 'Construction', icon: '🔨' }
  // NEW CATEGORY:
  // { id: 'nouvelle-categorie', label: 'Nouvelle Catégorie', icon: '🎁' }
];

// Then in private readonly imageConfigs, add:
'nouvelle-categorie': {
  folder: 'assets/nouvelle-categorie',
  images: [
    'image1.PNG',
    'image2.PNG',
    // ... list all images
  ],
  defaultPrice: 199,
  categoryName: 'Nouvelle Catégorie'
}
```

---

## Issue 4: Fixing Product Image Not Displaying

**File:** `src/app/shared/product-card/product-card.component.ts` and `.html`

### Check Image Binding (HTML)
```html
<!-- Current code in product-card.component.html -->
<img
  [src]="product?.imageUrl"
  [alt]="product?.name"
  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  loading="lazy"
/>
```

### Add Error Handling
```html
<!-- Enhanced with error handling -->
<img
  [src]="product?.imageUrl"
  [alt]="product?.name"
  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  loading="lazy"
  (error)="onImageError($event)"
  onerror="this.src='assets/placeholder.png'"
/>
```

### TypeScript Handler
```typescript
// In product-card.component.ts
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.warn('Image failed to load:', img.src);
    // Fallback to placeholder
    img.src = '/assets/placeholder.png';
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
```

---

## Issue 5: Fixing Route Not Working

**File:** `src/app/app.routes.ts`

### Check Current Routes (Around Line 93)
```typescript
// Current - should look like this:
{ path: 'catalogue-luxe', component: CatalogueLuxeComponent },
{ path: 'catalogue-luxe/:category', component: CatalogueLuxeComponent },
```

### If Missing, Add These Routes
```typescript
// In export const routes: Routes = [
export const routes: Routes = [
  // Public routes
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
  // ... other routes

  // CATALOGUE ROUTES - ADD IF MISSING:
  { path: 'catalogue-luxe', component: CatalogueLuxeComponent },
  { path: 'catalogue-luxe/:category', component: CatalogueLuxeComponent },
  { path: 'products/:id', component: ProductDetailComponent },

  // ... rest of routes
];
```

---

## Issue 6: Category Not Filtering Correctly

**File:** `src/app/catalogue-luxe/catalogue-luxe.component.ts`

### Problem: Category Route Change Not Working
```typescript
// Current implementation (should work):
private onCategoryRouteChange(categoryId: string | null): void {
  this.currentPage = 1;

  if (!categoryId) {
    this.selectedCategory = '';
    this.catalogueInfo = {
      categoryLabel: 'Tous les articles',
      description: 'Explorez notre sélection complète de luxe'
    };
  } else {
    const category = this.categories.find(c => c.id === categoryId);
    
    if (category) {
      this.selectedCategory = categoryId;
      this.catalogueInfo = {
        categoryId: categoryId,
        categoryLabel: `Catalogue ${category.label}`,
        description: `Découvrez tous nos ${category.label.toLowerCase()}`
      };
    } else {
      this.router.navigate(['/catalogue-luxe']);
      return;
    }
  }

  this.applyFilters();
}
```

### Enhanced With Better Error Handling
```typescript
private onCategoryRouteChange(categoryId: string | null): void {
  console.log('🔍 onCategoryRouteChange called with:', categoryId);
  this.currentPage = 1;

  if (!categoryId) {
    console.log('✅ No category - showing all products');
    this.selectedCategory = '';
    this.catalogueInfo = {
      categoryLabel: 'Tous les articles',
      description: 'Explorez notre sélection complète de luxe'
    };
  } else {
    // NEW: Try to resolve category ID
    const resolvedId = this.productService.resolveCategoryId(categoryId);
    console.log(`🔗 Resolved '${categoryId}' to '${resolvedId}'`);
    
    const category = this.categories.find(c => c.id === resolvedId);
    
    if (category) {
      console.log('✅ Category found:', category.label);
      this.selectedCategory = resolvedId;
      this.catalogueInfo = {
        categoryId: resolvedId,
        categoryLabel: `Catalogue ${category.label}`,
        description: `Découvrez tous nos ${category.label.toLowerCase()}`
      };
    } else {
      console.warn('❌ Category not found:', categoryId);
      this.router.navigate(['/catalogue-luxe']);
      return;
    }
  }

  this.applyFilters();
}
```

---

## Issue 7: Pagination Not Updating Correctly

**File:** `src/app/catalogue-luxe/catalogue-luxe.component.ts`

### Current Implementation (Should Work)
```typescript
updatePagination(): void {
  this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.displayedProducts = this.filteredProducts.slice(start, end);
  
  console.log('📊 Pagination mise à jour:');
  console.log('  - Produits filtrés:', this.filteredProducts.length);
  console.log('  - Produits affichés:', this.displayedProducts.length);
  console.log('  - Page courante:', this.currentPage, '/', this.totalPages);
}
```

### If Pagination is Wrong, Check These Methods Call It
```typescript
applyFilters(): void {
  // ... filter logic ...
  this.filteredProducts = filtered;
  this.applySorting();  // applySorting calls updatePagination
}

applySorting(): void {
  // ... sorting logic ...
  this.filteredProducts = sorted;
  this.updatePagination();  // ← MUST CALL THIS
}

onStateToggle(state: ProductState): void {
  const index = this.selectedStates.indexOf(state);
  if (index > -1) {
    this.selectedStates.splice(index, 1);
  } else {
    this.selectedStates.push(state);
  }
  this.currentPage = 1;  // Reset to page 1
  this.applyFilters();   // ← MUST CALL THIS
}

onPriceChange(): void {
  if (this.priceRange.min > this.priceRange.max) {
    const temp = this.priceRange.min;
    this.priceRange.min = this.priceRange.max;
    this.priceRange.max = temp;
  }
  this.currentPage = 1;  // Reset to page 1
  this.applyFilters();   // ← MUST CALL THIS
}
```

---

## Issue 8: Products Not Loading in Service

**File:** `src/app/services/product.service.ts`

### Check Constructor (Line ~220)
```typescript
constructor() {
  this.generateAllProducts();
  this.updateCategoryCounts();
}

private generateAllProducts(): void {
  let productId = 1;
  
  for (const [categoryId, config] of Object.entries(this.imageConfigs)) {
    const categoryProducts = this.generateProductsFromImages(
      config,
      this.resolveCategoryId(categoryId),
      productId
    );
    this.products.push(...categoryProducts);
    productId += categoryProducts.length;
  }
}
```

### Enhanced With Detailed Logging
```typescript
constructor() {
  console.log('🔧 ProductService initializing...');
  this.generateAllProducts();
  console.log(`✅ ProductService ready. Total products: ${this.products.length}`);
  this.updateCategoryCounts();
  
  // NEW: Log categories with counts
  this.categories.forEach(cat => {
    console.log(`  - ${cat.label}: ${cat.count} products`);
  });
}

private generateAllProducts(): void {
  console.log('📦 Generating products from image configs...');
  let productId = 1;
  let totalGenerated = 0;
  
  for (const [categoryId, config] of Object.entries(this.imageConfigs)) {
    console.log(`  Processing category: ${categoryId}`);
    console.log(`    - Images in config: ${config.images.length}`);
    
    const categoryProducts = this.generateProductsFromImages(
      config,
      this.resolveCategoryId(categoryId),
      productId
    );
    
    console.log(`    - Generated products: ${categoryProducts.length}`);
    this.products.push(...categoryProducts);
    totalGenerated += categoryProducts.length;
    productId += categoryProducts.length;
  }
  
  console.log(`✅ Total products generated: ${totalGenerated}`);
}
```

---

## Issue 9: Testing Products in Console

Once app is running, you can test in browser DevTools Console:

```javascript
// Get component instance
const component = ng.getComponent(document.querySelector('app-catalogue-luxe'));

// Get service
const service = component.productService;

// TEST 1: Check all products
console.log('Total products:', service.getProducts().length);
console.log('First product:', service.getProducts()[0]);

// TEST 2: Check by category
console.log('Vetements:', service.getProductsByCategory('vetements').length);
console.log('Electronique:', service.getProductsByCategory('electronique').length);

// TEST 3: Check category counts
console.log('Categories:', service.getCategories());

// TEST 4: Check filtered products
component.selectedCategory = 'vetements';
component.applyFilters();
console.log('After filtering by vetements:', component.filteredProducts.length);

// TEST 5: Check pagination
console.log('Current page:', component.currentPage);
console.log('Total pages:', component.totalPages);
console.log('Displayed products:', component.displayedProducts.length);

// TEST 6: Test image paths
component.displayedProducts.forEach(p => {
  console.log(`${p.name}: ${p.imageUrl}`);
});

// TEST 7: Test category resolution
console.log('vetement →', service.resolveCategoryId('vetement'));
console.log('VETEMENTS →', service.resolveCategoryId('VETEMENTS'));
console.log('accessoire →', service.resolveCategoryId('accessoire'));
```

---

## Issue 10: Complete Component Template Check

**File:** `src/app/catalogue-luxe/catalogue-luxe.component.html`

### Essential Template Parts to Verify

#### 1. Product Grid (Around Line 127-140)
```html
<!-- Products Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
  <ng-container *ngIf="displayedProducts.length > 0; else placeholderGrid">
    <app-product-card
      *ngFor="let product of displayedProducts; trackBy: trackByProductId"
      [product]="product"
      (favoriteToggle)="toggleFavorite($event)"
      (addToCart)="addToCart($event)"
      (viewDetail)="openProductDetail($event)"
    ></app-product-card>
  </ng-container>

  <ng-template #placeholderGrid>
    <app-product-card
      *ngFor="let _ of placeholderCards"
      [product]="null"
      [loading]="true"
      [showFavorite]="false"
    ></app-product-card>
  </ng-template>
</div>
```

#### 2. Check displayedProducts Variable
```html
<!-- Should show correct count -->
<div class="text-sm text-[#a19345]">
  Affichage de <span class="font-bold text-[#1d1a0c]">{{ filteredProducts.length }} articles</span> de luxe
</div>
```

#### 3. Pagination Controls (Around Line 150-170)
```html
<!-- Pagination -->
<div class="flex justify-center gap-2 mt-10">
  <button *ngFor="let page of getPageNumbers()" ...>
    {{ page === -1 ? '...' : page }}
  </button>
</div>
```

---

## Testing Checklist - Before Deploying

```bash
# 1. Check no TypeScript errors
ng build --configuration production 2>&1 | grep -i error

# 2. Run tests
ng test --watch=false

# 3. Lint code
ng lint

# 4. Check in browser
npm start
# Navigate to http://localhost:4200/catalogue-luxe
# Check console has no red errors
# Check Network tab has no 404s
# Check products display correctly
```

---

**Last Updated:** February 2, 2026  
**Version:** 1.0  
**For questions:** Refer to CATALOG_ANALYSIS.md for full details
