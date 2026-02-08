import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { ImageSlide } from '../image-slide/image-slide';
import { ProductService, Product } from '../services/product.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent, ImageSlide],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy, AfterViewInit {

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private productService = inject(ProductService);
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Pause auto scroll on hover (used in template)
  pauseScroll = false;
  pauseScroll2 = false;

  // Hero animation state
  heroAnimated = false;

  // ===================== DATA =====================
  // Produits vêtements & accessoires du ProductService
  get vetementAccessoireProducts(): Product[] {
    const vetements = this.productService.getProductsByCategory('vetements').slice(0, 5);
    const accessoires = this.productService.getProductsByCategory('accessoires').slice(0, 3);
    return [...vetements, ...accessoires];
  }

  get vetementAccessoireLoop(): Product[] {
    return [...this.vetementAccessoireProducts, ...this.vetementAccessoireProducts];
  }

  // Produits maison, électronique & jeux du ProductService
  get maisonElectroJeuxProducts(): Product[] {
    const maison = this.productService.getProductsByCategory('maison').slice(0, 4);
    const electronique = this.productService.getProductsByCategory('electronique').slice(0, 3);
    return [...maison, ...electronique];
  }

  get maisonElectroJeuxLoop(): Product[] {
    return [...this.maisonElectroJeuxProducts, ...this.maisonElectroJeuxProducts];
  }

  goToProduct(product: Product): void {
    console.log('Navigating to product:', product.id, product.name);
    this.router.navigate(['/products', product.id]);
  }

  // ===================== 3D COVERFLOW =====================
  expertiseCards = [
    'Vendeurs Vérifiés',
    'Paiement Sécurisé',
    'Livraison Rapide',
    'Produits de Qualité',
    'Support 24/7',
  ];

  private coverInterval: ReturnType<typeof setInterval> | undefined;

  goRegisterVendeur(): void {
    this.router.navigate(['/auth/vendeur-register']);
  }

  ngOnInit(): void {
    // Register ScrollTrigger plugin only in browser
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Trigger hero animation after a short delay
    setTimeout(() => {
      this.heroAnimated = true;
    }, 100);

    this.coverInterval = setInterval(() => {
      this.rotateCoverflow();
    }, 2500);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      // Petit délai pour laisser le DOM se stabiliser
      setTimeout(() => {
        this.initScrollAnimations();
      }, 200);
    });
  }

  /**
   * Initialise les animations scroll-trigger pour toutes les sections
   */
  private initScrollAnimations(): void {
    if (!this.isBrowser) return;

    // Animation pour les cards promotionnelles
    const promoCards = gsap.utils.toArray<HTMLElement>('.promo-card');
    promoCards.forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animation pour les sections de produits
    const productSections = gsap.utils.toArray<HTMLElement>('.products-section');
    productSections.forEach((section) => {
      const heading = section.querySelector<HTMLElement>('.section-heading');
      const scrollContainer = section.querySelector<HTMLElement>('.scroll-container');

      if (heading) {
        gsap.fromTo(heading,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      if (scrollContainer) {
        gsap.fromTo(scrollContainer,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // Animation pour la section vendeur
    const vendeurSection = document.querySelector<HTMLElement>('.vendeur-section');
    if (vendeurSection) {
      const leftContent = vendeurSection.querySelector<HTMLElement>('.vendeur-left');
      const rightContent = vendeurSection.querySelector<HTMLElement>('.vendeur-right');

      if (leftContent) {
        gsap.fromTo(leftContent,
          { opacity: 0, x: -60 },
          {
            opacity: 1, x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: vendeurSection,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      if (rightContent) {
        gsap.fromTo(rightContent,
          { opacity: 0, x: 60 },
          {
            opacity: 1, x: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: vendeurSection,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    // Animation pour les cards "Pourquoi Jotya"
    const whyCards = gsap.utils.toArray<HTMLElement>('.why-card');
    whyCards.forEach((card, index: number) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Animation pour les titres de section
    const sectionTitles = gsap.utils.toArray<HTMLElement>('.section-title');
    sectionTitles.forEach((title) => {
      gsap.fromTo(title,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  rotateCoverflow(): void {
    // 🔥 الطريقة الصحيحة مع Angular
    if (this.expertiseCards.length > 0) {
      this.expertiseCards = [
        ...this.expertiseCards.slice(1),
        this.expertiseCards[0],
      ];
    }
  }

  ngOnDestroy(): void {
    if (this.coverInterval) {
      clearInterval(this.coverInterval);
    }
    // Clean up all ScrollTrigger instances
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }
}
