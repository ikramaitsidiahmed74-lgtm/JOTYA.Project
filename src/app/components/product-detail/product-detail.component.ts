import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { SimilarProductsCarouselComponent } from './similar-products-carousel/similar-products-carousel.component';
import { CartService } from '../../services/cart.service';
import { Product as CartProduct } from '../../models/product.model';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';

// Interface étendue pour l'affichage
interface ProductDisplay {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  gallery?: string[];
  description?: string;
  specs?: { label: string; value: string }[];
  seller?: {
    id: number;
    name: string;
    rating: number;
    reviewsCount: number;
    avatarUrl?: string;
  };
  categoryId: string;
  badge?: string;
  state?: string;
  category?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SimilarProductsCarouselComponent, Header, Footer],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: ProductDisplay | null = null;
  selectedImage: string = '';
  quantity: number = 1;
  activeTab: 'specs' | 'reviews' | 'delivery' = 'specs';
  loading: boolean = false;
  
  // 3D Effect state
  is3DActive: boolean = false;
  rotationY: number = 0;
  private animationId: number | null = null;

  ngOnInit(): void {
    this.loading = true;
    
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      console.log('📦 Chargement du produit ID:', productId);
      this.loadProductData(productId);
    });
  }

  private loadProductData(productId: number): void {
    const serviceProduct = this.productService.getProductById(productId);
    
    if (serviceProduct) {
      console.log('✅ Produit trouvé:', serviceProduct.name);
      
      // Mapper le produit du service vers notre interface d'affichage
      this.product = {
        id: serviceProduct.id,
        name: serviceProduct.name,
        price: serviceProduct.price,
        imageUrl: serviceProduct.imageUrl,
        gallery: [serviceProduct.imageUrl], // Une seule image pour l'instant
        badge: this.mapStateToBadge(serviceProduct.state),
        description: `${serviceProduct.name} - ${serviceProduct.state}. Produit vérifié et inspecté par notre équipe.`,
        categoryId: serviceProduct.category,
        category: serviceProduct.category,
        state: serviceProduct.state,
        specs: [
          { label: 'Catégorie', value: serviceProduct.category },
          { label: 'État', value: serviceProduct.state },
          { label: 'Vérifié', value: serviceProduct.verified ? 'Oui ✓' : 'Non' }
        ],
        seller: {
          id: 1,
          name: 'JOTYA Store',
          rating: 4.8,
          reviewsCount: 342,
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop'
        }
      };

      this.selectedImage = this.product.imageUrl;
    } else {
      console.error('❌ Produit non trouvé pour ID:', productId);
      this.product = null;
    }
    
    this.loading = false;
  }

  private mapStateToBadge(state: string): string {
    switch (state) {
      case 'Neuf avec étiquette':
        return 'NEUF';
      case 'Excellent état':
        return 'COMME NEUF';
      case 'Très bon état':
        return 'BON ÉTAT';
      default:
        return state.toUpperCase();
    }
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      const cartProduct: CartProduct = {
        id: String(this.product.id),
        name: this.product.name,
        brand: this.product.category || 'JOTYA',
        condition: this.product.state || 'Excellent état',
        price: this.product.price,
        imageUrl: this.product.imageUrl
      };
      this.cartService.addItem(cartProduct, this.quantity);
      console.log(`✅ Ajout au panier : ${this.quantity}x ${this.product.name}`);
    }
  }

  setActiveTab(tab: 'specs' | 'reviews' | 'delivery'): void {
    this.activeTab = tab;
  }

  contactSeller(): void {
    if (this.product?.seller) {
      console.log(`Contact avec le vendeur : ${this.product.seller.name}`);
      alert(`Ouverture du formulaire de contact avec ${this.product.seller.name}`);
      // TODO: Implémenter l'ouverture d'un modal de contact
    }
  }

  // Fonction utilitaire pour formater les prix en arabe (DH)
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Navigation SPA vers un produit similaire
  viewProductDetail(productId: number): void {
    this.router.navigate(['/products', productId]);
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 3D Effect Methods
  toggle3DEffect(): void {
    if (this.is3DActive) {
      this.deactivate3D();
    } else {
      this.activate3D();
    }
  }

  private activate3D(): void {
    this.is3DActive = true;
    this.rotationY = 0;
    document.body.style.overflow = 'hidden';
  }

  deactivate3D(): void {
    this.is3DActive = false;
    this.rotationY = 0;
    document.body.style.overflow = '';
  }

  private startRotation(): void {
    // Not used anymore
  }

  private stopRotation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  goBack(): void {
    window.history.back();
  }

  get imageTransform(): string {
    return 'none';
  }
}
