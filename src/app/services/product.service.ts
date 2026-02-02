import { Injectable } from '@angular/core';
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
      categoryName: 'Maison'
    },
    accessoires: {
      folder: 'assets/accessoires',
      images: [],
      defaultPrice: 149,
      categoryName: 'Accessoires'
    },
    'pieces-uniques': {
      folder: 'assets/pieces-uniques',
      images: [],
      defaultPrice: 249,
      categoryName: 'Pièces Uniques'
    },
    marques: {
      folder: 'assets/marques',
      images: [],
      defaultPrice: 599,
      categoryName: 'Marques'
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
    },
    chaussures: {
      folder: 'assets/chaussures',
      images: [],
      defaultPrice: 249,
      categoryName: 'Chaussures'
    },
    lunettes: {
      folder: 'assets/lunettes',
      images: [],
      defaultPrice: 179,
      categoryName: 'Lunettes'
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
    { id: 'chaussures', label: 'Chaussures', iconSvg: CATEGORY_ICON_SVGS['chaussures'], icon: '👟' },
    { id: 'lunettes', label: 'Lunettes', iconSvg: CATEGORY_ICON_SVGS['lunettes'], icon: '🕶️' },
    { id: 'pieces-uniques', label: 'Pièces Uniques', icon: '✨' },
    { id: 'maison', label: 'Maison', icon: '🏠' },
    { id: 'marques', label: 'Marques', icon: '⭐' },
    { id: 'velo', label: 'Vélo', icon: '🚲' },
    { id: 'construction', label: 'Construction', icon: '🔨' }
  ];

  private products: Product[] = [];

  constructor() {
    this.generateAllProducts();
    this.updateCategoryCounts();
  }

  resolveCategoryId(categoryId: string): string {
    const normalized = categoryId.toLowerCase().trim();
    if (normalized === 'vetement') {
      return 'vetements';
    }
    if (normalized === 'accessoire') {
      return 'accessoires';
    }
    if (normalized === 'chaussure') {
      return 'chaussures';
    }
    if (normalized === 'lunette') {
      return 'lunettes';
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
      // Utiliser le prix fixe si défini, sinon utiliser defaultPrice sans variation
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
