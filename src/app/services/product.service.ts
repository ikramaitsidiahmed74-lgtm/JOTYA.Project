import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, delay, map } from 'rxjs/operators';
import { CATEGORY_ICON_SVGS } from '../shared/icons/category-icons';

export type ProductState = 'Neuf avec étiquette' | 'Excellent état' | 'Très bon état';

export interface Category {
  id: string;
  label: string;
  icon?: string;
  iconSvg?: string;
  count?: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  state: ProductState;
  imageUrl: string;
  verified: boolean;
  rating?: number;
  isFavorite?: boolean;
}

// Configuration des images par catégorie
interface CategoryImageConfig {
  folder: string;
  images: string[];
  defaultPrice: number;
  categoryName: string;
  productPrices?: { [imageName: string]: number }; // Prix fixes par produit
  productNames?: { [imageName: string]: string }; // Noms fixes par produit
  priceRange?: { min: number; max: number };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  // Liste des images par catégorie - AJOUTER VOS IMAGES ICI
  private readonly imageConfigs: Record<string, CategoryImageConfig> = {
    vetements: {
      folder: 'assets/vetements',
      images: [
        'V5.PNG',
        'V10.PNG',
        'V9.PNG',
        'V1.jpg',
        '07878532805-e2.jpg',
        'd9a97503-da9f-4e98-b957-3bc5ccf819e0.jpeg',
        'JUPE1.PNG',
        'V11.PNG',
        'v17.PNG',
        'V2.jpg',
        'V3.jpg',
        'V4.PNG',
        'V6.PNG',
        'V7.PNG',
        'V8.PNG',
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
      defaultPrice: 89,
      categoryName: 'Vêtements',
      productPrices: {
        'V5.PNG': 99,
        'V10.PNG': 60,
        'V9.PNG': 30,
        'V1.jpg': 79,
        '07878532805-e2.jpg': 45,
        'd9a97503-da9f-4e98-b957-3bc5ccf819e0.jpeg': 55,
        'JUPE1.PNG': 65,
        'V11.PNG': 120,
        'v17.PNG': 95,
        'V2.jpg': 75,
        'V3.jpg': 85,
        'V4.PNG': 110,
        'V6.PNG': 40,
        'V7.PNG': 70,
        'V8.PNG': 130,
        'vet jacket.PNG': 145,
        'vet pantalon.PNG': 50,
        'vete jk.PNG': 140,
        'vetemt ik.PNG': 105,
        'vetik.PNG': 35,
        'VT2.PNG': 88,
        'VT21.PNG': 115,
        'VT22.PNG': 125,
        'VT23.PNG': 135,
        'VT28.PNG': 150,
        'VT35.PNG': 100
      },
      productNames: {
        'V5.PNG': 'Robe Courte',
        'V10.PNG': 'Mini Djellaba',
        'V9.PNG': 'Pantalon Femme',
        'V1.jpg': 'Jacket Cuire'
      }
    },
    electronique: {
      folder: 'assets/electro',
      images: [
        'CAMERA AVEC BAF2.PNG',
        'camera1.PNG',
        'CHANIYOR.PNG',
        'PC GAME1 - Copie.PNG',
        'PC1.PNG',
        'PLS1.PNG',
        'PLS2.PNG',
        'PLS4.PNG',
        'TELE1.PNG',
        'TELE3.PNG',
        'TELESGHIRE1.PNG'
      ],
      defaultPrice: 499,
      categoryName: 'Électronique'
    },
    maison: {
      folder: 'assets/maison',
      images: [
        'ACS2.PNG',
        'ACS4.PNG',
        'ACS5.PNG',
        'acs51.PNG',
        'ACSSISOIRE 1.PNG',
        'CHI HAJA.PNG',
        'FIJANE1.PNG',
        'FINJAN2.PNG',
        'KHALATE2.PNG',
        'KHATTT.PNG',
        'LMANTA10.PNG',
        'LMANTA11.PNG',
        'MAHRAZ1.PNG',
        'MIKNASSA1.PNG',
        'mizane1.PNG',
        'TABSSIL1.PNG',
        'TAZARBITE4.PNG',
        'V15.PNG',
        'V16.PNG',
        'ZARBIA2.PNG',
        'ZARBIA3.PNG',
        'ZARBIA5.PNG',
        'ZARBIA6.PNG'
      ],
      defaultPrice: 299,
      priceRange: { min: 100, max: 300 },
      categoryName: 'Maison'
    },
    accessoires: {
      folder: 'assets',
      images: [
        'V12.jpg',
        'V13.jpg',
        'V14.jpg'
      ],
      defaultPrice: 149,
      categoryName: 'Accessoires',
      productPrices: {
        'V12.jpg': 79,
        'V13.jpg': 349,
        'V14.jpg': 80
      },
      productNames: {
        'V12.jpg': 'Sac Cuire',
        'V13.jpg': 'Collie',
        'V14.jpg': 'Chasseurs Talonts'
      }
    },
    'pieces-uniques': {
      folder: 'assets/Les piéce unique',
      images: [
        'acs\'.PNG',
        'acs112.PNG',
        'ACS3.PNG',
        'ACS4.PNG',
        'ACS5.PNG',
        'acs6.PNG',
        'ACSSISOIRE 1.PNG',
        'ASDD.PNG',
        'Capture.PNG',
        'DICOREA.PNG',
        'DIR1.PNG',
        'ghazla.PNG',
        'golf sok.PNG',
        'HS33.PNG',
        'V13.jpg'
      ],
      defaultPrice: 1200,
      categoryName: 'Pièces Uniques',
      productPrices: {
        'acs\'.PNG': 750,
        'acs112.PNG': 1100,
        'ACS3.PNG': 890,
        'ACS4.PNG': 1450,
        'ACS5.PNG': 2100,
        'acs6.PNG': 680,
        'ACSSISOIRE 1.PNG': 1800,
        'ASDD.PNG': 2350,
        'Capture.PNG': 550,
        'DICOREA.PNG': 1950,
        'DIR1.PNG': 1300,
        'ghazla.PNG': 2200,
        'golf sok.PNG': 950,
        'HS33.PNG': 1650,
        'V13.jpg': 2450
      }
    },
    marques: {
      folder: 'assets/les marque rare',
      images: [
        'HS44.PNG',
        'ik vetem.PNG',
        'ikvet.PNG',
        'JAQUIT.PNG',
        'marque.PNG',
        'marquee.PNG',
        'MONTO2.PNG',
        'mtr.PNG',
        'PONTALON marque.PNG',
        'sac.PNG',
        'V12.jpg',
        'V4.PNG',
        'vetik.PNG'
      ],
      defaultPrice: 450,
      categoryName: 'Marques',
      productPrices: {
        'HS44.PNG': 320,
        'ik vetem.PNG': 450,
        'ikvet.PNG': 580,
        'JAQUIT.PNG': 690,
        'marque.PNG': 520,
        'marquee.PNG': 280,
        'MONTO2.PNG': 650,
        'mtr.PNG': 700,
        'PONTALON marque.PNG': 390,
        'sac.PNG': 550,
        'V12.jpg': 240,
        'V4.PNG': 480,
        'vetik.PNG': 360
      }
    },
    velo: {
      folder: 'assets/velo',
      images: [
        'endurobike1.PNG',
        'VELO SANTA1.PNG',
        'VELO1.PNG',
        'VELO3.PNG',
        'velo4.PNG',
        'VELO5.PNG',
        'velo6.PNG'
      ],
      defaultPrice: 8500,
      categoryName: 'Vélo',
      productPrices: {
        'endurobike1.PNG': 15000,
        'VELO SANTA1.PNG': 12500,
        'VELO1.PNG': 2000,
        'VELO3.PNG': 3000,
        'velo4.PNG': 2500,
        'VELO5.PNG': 4500,
        'velo6.PNG': 5500
      }
    },
    construction: {
      folder: 'assets/construction',
      images: [
        'CASSE D\'injection 1.PNG',
        'CHANIYOR1.PNG',
        'CHANYOR1.PNG',
        'HFAR1.PNG',
        'panneux s 1.PNG',
        'PINCE COUPE.PNG'
      ],
      defaultPrice: 349,
      categoryName: 'Construction',
      productPrices: {
        'CASSE D\'injection 1.PNG': 450,
        'CHANIYOR1.PNG': 280,
        'CHANYOR1.PNG': 320,
        'HFAR1.PNG': 550,
        'panneux s 1.PNG': 380,
        'PINCE COUPE.PNG': 290
      }
    }
  };

  private readonly states: ProductState[] = [
    'Neuf avec étiquette',
    'Excellent état',
    'Très bon état'
  ];

  private readonly categories: Category[] = [
    { id: 'vetements', label: 'Vêtements', iconSvg: CATEGORY_ICON_SVGS['vetements'], icon: '👔' },
    { id: 'accessoires', label: 'Accessoires', iconSvg: CATEGORY_ICON_SVGS['accessoires'], icon: '👜' },
    { id: 'electronique', label: 'Électronique', iconSvg: CATEGORY_ICON_SVGS['electronique'], icon: '📱' },
    { id: 'pieces-uniques', label: 'Pièces Uniques', iconSvg: CATEGORY_ICON_SVGS['pieces-uniques'], icon: '✨' },
    { id: 'maison', label: 'Maison', iconSvg: CATEGORY_ICON_SVGS['maison'], icon: '🏠' },
    { id: 'marques', label: 'Marques', iconSvg: CATEGORY_ICON_SVGS['marques'], icon: '⭐' },
    { id: 'velo', label: 'Vélo', iconSvg: CATEGORY_ICON_SVGS['velo'], icon: '🚲' },
    { id: 'construction', label: 'Construction', iconSvg: CATEGORY_ICON_SVGS['construction'], icon: '🔨' }
  ];

  private products: Product[] = [];
  private readonly apiUrl = '/api/products';

  // BehaviorSubject to expose pending (to validate) products for admin
  private _pendingProducts = new BehaviorSubject<Product[]>([]);
  pendingProducts$ = this._pendingProducts.asObservable();
  
  // BehaviorSubject for all products (reactive store)
  private _products = new BehaviorSubject<Product[]>(this.products);
  products$ = this._products.asObservable();

  constructor(private http: HttpClient) {
    this.generateAllProducts();
    this.updateCategoryCounts();
    // initialize pending list based on generated products
    this.syncPendingFromLocal();
  }

  private syncPendingFromLocal(): void {
    const pending = this.products.filter(p => !p.verified);
    this._pendingProducts.next(pending);
  }

  private syncProductsToStore(): void {
    this._products.next(this.products.slice());
  }

  resolveCategoryId(categoryId: string): string {
    const normalized = categoryId.toLowerCase().trim();
    if (normalized === 'vetement') {
      return 'vetements';
    }
    if (normalized === 'accessoire') {
      return 'accessoires';
    }
    return normalized;
  }

  /**
   * Génère tous les produits à partir des configurations d'images
   */
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

  /**
   * Génère les produits pour une catégorie à partir de ses images
   */
  private generateProductsFromImages(
    config: CategoryImageConfig,
    categoryId: string,
    startId: number
  ): Product[] {
    return config.images.map((imageName, index) => {
      const productPrice = this.determineProductPrice(config, imageName);
      
      // Utiliser le nom fixe si défini, sinon générer automatiquement
      const productName = config.productNames && config.productNames[imageName]
        ? config.productNames[imageName]
        : this.generateProductName(imageName, categoryId);
      
      return {
        id: startId + index,
        name: productName,
        category: categoryId,
        price: productPrice,
        state: this.getRandomState(),
        imageUrl: `${config.folder}/${imageName}`,
        verified: Math.random() > 0.3,
        rating: this.generateRating(),
        isFavorite: false
      };
    });
  }

  /**
   * Génère un nom de produit lisible à partir du nom de fichier
   */
  private generateProductName(fileName: string, categoryId: string): string {
    // Retirer l'extension
    const nameWithoutExt = fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    
    // Remplacer les caractères spéciaux par des espaces
    let cleanName = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Capitaliser chaque mot
    cleanName = cleanName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Si le nom est trop court ou juste des codes, ajouter un préfixe
    if (cleanName.length < 4 || /^[A-Z0-9\s]+$/i.test(cleanName)) {
      const prefixes: Record<string, string[]> = {
        vetements: ['Tenue', 'Ensemble', 'Vêtement', 'Article Mode'],
        accessoires: ['Accessoire', 'Article'],
        electronique: ['Appareil', 'Device'],
        maison: ['Décoration', 'Article Maison'],
        'pieces-uniques': ['Pièce', 'Article Unique'],
        marques: ['Article Premium'],
        velo: ['Équipement Vélo'],
        construction: ['Outil', 'Matériel']
      };
      const categoryPrefixes = prefixes[categoryId] || ['Article'];
      const prefix = categoryPrefixes[Math.floor(Math.random() * categoryPrefixes.length)];
      return `${prefix} ${cleanName}`;
    }
    
    return cleanName;
  }

  /**
   * Génère un prix avec variation autour du prix par défaut
   */
  private generatePrice(basePrice: number): number {
    const variation = basePrice * 0.5; // ±50%
    const price = basePrice + (Math.random() * variation * 2 - variation);
    return Math.round(price / 10) * 10; // Arrondir à la dizaine
  }

  private determineProductPrice(config: CategoryImageConfig, imageName: string): number {
    if (config.productPrices && config.productPrices[imageName]) {
      return config.productPrices[imageName];
    }
    if (config.priceRange) {
      return this.generatePriceInRange(config.priceRange.min, config.priceRange.max);
    }
    return config.defaultPrice;
  }

  private generatePriceInRange(min: number, max: number): number {
    const range = Math.abs(max - min);
    const price = min + Math.random() * range;
    return Math.round(price / 10) * 10;
  }

  /**
   * Retourne un état aléatoire
   */
  private getRandomState(): ProductState {
    return this.states[Math.floor(Math.random() * this.states.length)];
  }

  /**
   * Génère une note entre 3.5 et 5.0
   */
  private generateRating(): number {
    return Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
  }

  /**
   * Met à jour les compteurs de produits par catégorie
   */
  private updateCategoryCounts(): void {
    this.categories.forEach(category => {
      category.count = this.products.filter(
        p => this.resolveCategoryId(p.category) === this.resolveCategoryId(category.id)
      ).length;
    });
  }

  // ========== API PUBLIQUE ==========

  getProducts(): Product[] {
    return this.products;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getProductsByCategory(categoryId: string): Product[] {
    const resolved = this.resolveCategoryId(categoryId);
    return this.products.filter(
      product => this.resolveCategoryId(product.category) === resolved
    );
  }

  getCategoryById(categoryId: string): Category | undefined {
    const resolved = this.resolveCategoryId(categoryId);
    return this.categories.find(cat => this.resolveCategoryId(cat.id) === resolved);
  }

  /**
   * Ajoute dynamiquement des images à une catégorie
   */
  addImagesToCategory(categoryId: string, imageNames: string[]): void {
    const config = this.imageConfigs[categoryId];
    if (config) {
      const startId = this.products.length + 1;
      const newProducts = imageNames.map((imageName, index) => {
        // Utiliser le prix fixe si défini, sinon utiliser defaultPrice
        const productPrice = config.productPrices && config.productPrices[imageName] 
          ? config.productPrices[imageName] 
          : config.defaultPrice;
        
        return {
          id: startId + index,
          name: this.generateProductName(imageName, categoryId),
          category: categoryId,
          price: productPrice,
          state: this.getRandomState(),
          imageUrl: `${config.folder}/${imageName}`,
          verified: Math.random() > 0.3,
          rating: this.generateRating(),
          isFavorite: false
        };
      });
      this.products.push(...newProducts);
      this.updateCategoryCounts();
    }
  }

  /**
   * Récupère un produit par son ID
   */
  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  /**
   * Fetch pending products for validation (supports server if available)
   */
  fetchPendingProducts(params?: { page?: number; pageSize?: number; q?: string; [key: string]: any }): Observable<{ items: Product[]; total: number }> {
    // If a backend exists at apiUrl, prefer it. Otherwise return local generated pending products.
    if (this.http) {
      const httpParams: any = Object.assign({}, params);
      return this.http.get<any>(`${this.apiUrl}/pending`, { params: httpParams }).pipe(
        map(resp => {
          // support APIs that return either an array or a { items, total } shape
          if (Array.isArray(resp)) {
            return { items: resp as Product[], total: resp.length };
          }
          // assume { items, total }
          return { items: resp.items || [], total: resp.total || (resp.items ? resp.items.length : 0) };
        }),
        tap(res => this._pendingProducts.next(res.items)),
        catchError(err => {
          // fallback to local
          this.syncPendingFromLocal();
          const fallback = this._pendingProducts.value.slice();
          return of({ items: fallback, total: fallback.length });
        })
      );
    }

    // fallback: local filtering + pagination
    const pending = this.products.filter(p => !p.verified);
    const q = (params && params.q) ? (params.q as string).toLowerCase().trim() : '';
    const filtered = q ? pending.filter(p => (p.name || '').toLowerCase().includes(q) || ((p as any).seller || '').toLowerCase().includes(q)) : pending;
    const page = params && params.page ? Number(params.page) : 1;
    const pageSize = params && params.pageSize ? Number(params.pageSize) : 6;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    // update subject
    this._pendingProducts.next(items);
    return of({ items, total: filtered.length }).pipe(delay(0));
  }

  /**
   * Approve a product (call API if available) and update local state
   */
  approveProduct(id: number): Observable<void> {
    if (this.http) {
      return this.http.post<void>(`${this.apiUrl}/${id}/approve`, {}).pipe(
        tap(() => this.markProductVerified(id)),
        catchError(err => throwError(() => err))
      );
    }
    // Local fallback: mark verified and update subject
    this.markProductVerified(id);
    this.syncProductsToStore();
    return of(void 0).pipe(delay(200));
  }

  /**
   * Refuse a product (call API if available) and update local state
   */
  refuseProduct(id: number): Observable<void> {
    if (this.http) {
      return this.http.post<void>(`${this.apiUrl}/${id}/refuse`, {}).pipe(
        tap(() => this.removeProductFromList(id)),
        catchError(err => throwError(() => err))
      );
    }
    // Local fallback: remove from local list
    this.removeProductFromList(id);
    this.syncProductsToStore();
    return of(void 0).pipe(delay(200));
  }

  private markProductVerified(id: number) {
    const prod = this.products.find(p => p.id === id);
    if (prod) {
      prod.verified = true;
    }
    // update pending list
    this._pendingProducts.next(this._pendingProducts.value.filter(p => p.id !== id));
    // update full products store
    this._products.next(this.products.slice());
  }

  removeProductFromList(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    if (index > -1) {
      this.products.splice(index, 1);
      this.updateCategoryCounts();
      // update both stores
      this._pendingProducts.next(this._pendingProducts.value.filter(p => p.id !== id));
      this._products.next(this.products.slice());
    }
  }

  /**
   * Récupère les produits similaires (même catégorie, excluant le produit actuel)
   */
  getSimilarProducts(productId: number, limit: number = 6): Product[] {
    const product = this.getProductById(productId);
    if (!product) return [];

    return this.products
      .filter(p => 
        this.resolveCategoryId(p.category) === this.resolveCategoryId(product.category) &&
        p.id !== productId
      )
      .slice(0, limit);
  }
}
