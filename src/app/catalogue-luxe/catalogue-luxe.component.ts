import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, Product, ProductService, ProductState } from '../services/product.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { CATEGORY_ICON_DEFAULT, CATEGORY_ICON_SVGS } from '../shared/icons/category-icons';
import { CartService } from '../services/cart.service';
import { Product as CartProduct } from '../models/product.model';

type SortOption = 'nouveautes' | 'prix-asc' | 'prix-desc' | 'rating';

/**
 * Interface pour gérer les informations du catalogue courant
 */
interface CatalogueInfo {
  categoryId?: string;
  categoryLabel: string;
  description: string;
}

@Component({
  selector: 'app-catalogue-luxe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent],
  templateUrl: './catalogue-luxe.component.html',
  styleUrl: './catalogue-luxe.component.css'
})
export class CatalogueLuxeComponent implements OnInit, OnDestroy {
  // Données
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  categories: Category[] = [];
  states: ProductState[] = ['Neuf avec étiquette', 'Excellent état', 'Très bon état'];
  placeholderCards = Array.from({ length: 6 });

  // Filtres
  selectedCategory = '';
  selectedStates: ProductState[] = [];
  priceRange = { min: 0, max: 20000 };
  
  // Prix
  readonly minPrice = 0;
  readonly maxPrice = 20000;

  // Tri et pagination
  sortBy: SortOption = 'nouveautes';
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Catalogue info (dynamique selon la route)
  catalogueInfo: CatalogueInfo = {
    categoryLabel: 'Tous les articles',
    description: 'Explorez notre sélection complète'
  };

  categoryIcons = new Map<string, SafeHtml>();
  defaultCategoryIcon: SafeHtml;

  // Options de tri
  sortOptions = [
    { value: 'nouveautes', label: 'Nouveautés' },
    { value: 'prix-asc', label: 'Prix croissant' },
    { value: 'prix-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' }
  ];

  // RxJS unsubscribe
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly cartService: CartService
  ) {
    this.defaultCategoryIcon = this.toSafeIcon();
  }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Gère le changement de catégorie via la route
   * @param categoryId Identifiant de la catégorie depuis la route
   */
  private onCategoryRouteChange(categoryId: string | null): void {
    // Réinitialiser la pagination
    this.currentPage = 1;

    if (!categoryId) {
      // Pas de catégorie = afficher tous les produits
      this.selectedCategory = '';
      this.catalogueInfo = {
        categoryLabel: 'Tous les articles',
        description: 'Explorez notre sélection complète de luxe'
      };
    } else {
      // Une catégorie est sélectionnée
      const category = this.categories.find(c => c.id === categoryId);
      
      if (category) {
        this.selectedCategory = categoryId;
        this.catalogueInfo = {
          categoryId: categoryId,
          categoryLabel: `Catalogue ${category.label}`,
          description: `Découvrez tous nos ${category.label.toLowerCase()}`
        };
      } else {
        // Catégorie invalide, rediriger vers catalogue général
        this.router.navigate(['/catalogue-luxe']);
        return;
      }
    }

    // Appliquer les filtres avec la nouvelle catégorie
    this.applyFilters();
  }

  /**
   * Applique tous les filtres (catégorie, état, prix)
   */
  applyFilters(): void {
    let filtered = [...this.products];

    // Filtre par catégorie
    if (this.selectedCategory) {
      // Utiliser resolveCategoryId pour normaliser les variations (vetement -> vetements)
      const resolvedCategory = this.productService.resolveCategoryId(this.selectedCategory);
      filtered = filtered.filter(p => 
        this.productService.resolveCategoryId(p.category) === resolvedCategory
      );
    }

    // Filtre par état
    if (this.selectedStates.length > 0) {
      filtered = filtered.filter(p => this.selectedStates.includes(p.state));
    }

    // Filtre par prix
    filtered = filtered.filter(p => p.price >= this.priceRange.min && p.price <= this.priceRange.max);

    this.filteredProducts = filtered;
    this.applySorting();
  }

  /**
   * Applique le tri sélectionné
   */
  applySorting(): void {
    let sorted = [...this.filteredProducts];

    // Si "Tout le Catalogue" (pas de catégorie) et tri par nouveautés, mélanger pour avoir de la variété
    if (!this.selectedCategory && this.sortBy === 'nouveautes') {
      sorted = this.getVariedProducts(sorted);
    } else {
      switch (this.sortBy) {
        case 'prix-asc':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'prix-desc':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'nouveautes':
        default:
          // Ordre par défaut (id décroissant = nouveautés)
          sorted.sort((a, b) => b.id - a.id);
          break;
      }
    }

    this.filteredProducts = sorted;
    this.updatePagination();
  }

  /**
   * Retourne des produits variés de différentes catégories, mélangés aléatoirement
   */
  private getVariedProducts(products: Product[]): Product[] {
    // Grouper par catégorie
    const byCategory = new Map<string, Product[]>();
    for (const product of products) {
      const cat = this.productService.resolveCategoryId(product.category);
      if (!byCategory.has(cat)) {
        byCategory.set(cat, []);
      }
      byCategory.get(cat)!.push(product);
    }

    // Mélanger chaque groupe
    byCategory.forEach((prods) => {
      for (let i = prods.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [prods[i], prods[j]] = [prods[j], prods[i]];
      }
    });

    // Construire la liste finale en prenant des produits de chaque catégorie à tour de rôle
    const result: Product[] = [];
    const categories = Array.from(byCategory.keys());
    
    // Mélanger l'ordre des catégories
    for (let i = categories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [categories[i], categories[j]] = [categories[j], categories[i]];
    }

    let index = 0;
    while (result.length < products.length) {
      let added = false;
      for (const cat of categories) {
        const catProducts = byCategory.get(cat)!;
        if (index < catProducts.length) {
          result.push(catProducts[index]);
          added = true;
        }
      }
      if (!added) break;
      index++;
    }

    return result;
  }

  /**
   * Met à jour la pagination et les produits affichés
   */
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

  /**
   * Réinitialise tous les filtres et retourne au catalogue général
   */
  resetFilters(): void {
    this.selectedStates = [];
    this.priceRange = { min: this.minPrice, max: this.maxPrice };
    this.currentPage = 1;
    // Navigue vers le catalogue général (réinitialise aussi la catégorie)
    this.router.navigate(['/catalogue-luxe']);
  }

  /**
   * Gère la sélection d'une catégorie via le sidebar
   * Navigue vers la route appropriée au lieu de modifier directement selectedCategory
   */
  onCategorySelect(categoryId: string): void {
    if (this.selectedCategory === categoryId) {
      // Clic sur la catégorie active = retour au catalogue général
      this.router.navigate(['/catalogue-luxe']);
    } else {
      // Navigation vers la catégorie
      this.router.navigate(['/catalogue-luxe', categoryId]);
    }
  }

  /**
   * Gère le clic sur une catégorie (alias pour onCategorySelect)
   */
  onCategoryClick(categoryId: string): void {
    this.onCategorySelect(categoryId);
  }

  /**
   * Gère le toggle d'un état (checkbox)
   */
  onStateToggle(state: ProductState): void {
    const index = this.selectedStates.indexOf(state);
    if (index > -1) {
      this.selectedStates.splice(index, 1);
    } else {
      this.selectedStates.push(state);
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Gère le changement de prix
   */
  onPriceChange(): void {
    // Assure que min <= max
    if (this.priceRange.min > this.priceRange.max) {
      const temp = this.priceRange.min;
      this.priceRange.min = this.priceRange.max;
      this.priceRange.max = temp;
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Gère le changement de tri
   */
  onSortChange(): void {
    this.applySorting();
  }

  /**
   * Toggle favori d'un produit
   */
  toggleFavorite(product: Product): void {
    product.isFavorite = !product.isFavorite;
  }

  /**
   * Ajouter au panier
   */
  addToCart(product: Product): void {
    // Convert ProductService.Product to Cart's Product model
    const cartProduct: CartProduct = {
      id: String(product.id),
      name: product.name,
      brand: product.category || 'JOTYA',
      condition: product.state,
      price: product.price,
      imageUrl: product.imageUrl
    };
    this.cartService.addItem(cartProduct, 1);
    console.log('✅ Ajouté au panier:', product.name);
  }

  /**
   * Ouvrir le détail d'un produit
   */
  openProductDetail(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  /**
   * Charger plus de produits
   */
  loadMore(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /**
   * Aller à une page spécifique
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  /**
   * Vérifie si une catégorie est active
   */
  isCategoryActive(categoryId: string): boolean {
    return this.selectedCategory === categoryId;
  }

  /**
   * Vérifie si un état est sélectionné
   */
  isStateSelected(state: ProductState): boolean {
    return this.selectedStates.includes(state);
  }

  /**
   * Retourne la classe CSS pour l'état d'un produit
   */
  getStateClass(state: ProductState): string {
    switch (state) {
      case 'Neuf avec étiquette':
        return 'bg-emerald-50 text-emerald-700';
      case 'Excellent état':
        return 'bg-sky-50 text-sky-700';
      case 'Très bon état':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  }

  trackByProductId(index: number, item: Product): number | string {
    return item?.id ?? index;
  }

  /**
   * Retourne le style de la carte selon son index (alternance de couleurs)
   */
  getCardStyle(index: number): 'default' | 'mint' | 'cream' {
    // Pattern: default, mint, default, default, mint, cream...
    const patterns: ('default' | 'mint' | 'cream')[] = ['default', 'mint', 'default', 'default', 'mint', 'cream'];
    return patterns[index % patterns.length];
  }

  /**
   * Génère un tableau de numéros de pages pour la pagination
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (this.currentPage > 3) {
        pages.push(-1); // Ellipse
      }
      
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (this.currentPage < this.totalPages - 2) {
        pages.push(-1); // Ellipse
      }
      
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  private buildCategoryIcons(): void {
    this.categoryIcons.clear();

    this.categories.forEach(category => {
      const resolvedId = this.productService.resolveCategoryId(category.id);
      const rawIcon = CATEGORY_ICON_SVGS[resolvedId] || category.iconSvg || category.icon;
      this.categoryIcons.set(category.id, this.toSafeIcon(rawIcon));
    });
  }

  private toSafeIcon(markup?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(markup?.trim() || CATEGORY_ICON_DEFAULT);
  }
}
