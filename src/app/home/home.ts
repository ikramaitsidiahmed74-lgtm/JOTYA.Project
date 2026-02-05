import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy, AfterViewInit {

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Pause auto scroll on hover
  pauseScroll = false;
  pauseScroll2 = false;

  // Hero animation state
  heroAnimated = false;

  // 3D Carousel Data - Images for rotating carousel
  carouselImages = [
    '/assets/V1.jpg',
    '/assets/V5.PNG',
    '/assets/V10.PNG',
    '/assets/V9.PNG',
    '/assets/V12.jpg',
    '/assets/V13.jpg',
    '/assets/V14.jpg',
    '/assets/V18.PNG',
    '/assets/V19.PNG',
    '/assets/V20.PNG',
    '/assets/V21.PNG',
    '/assets/V22.PNG'
  ];

  constructor(private router: Router) {}

  goRegisterVendeur() {
    this.router.navigate(['/auth/vendeur-register']);
  }

  // ===================== DATA =====================
  categories = [
    {
      name: 'Vêtements',
      products: [
        { id: 1, name: 'jacket Cuire', price: 79, image: '/assets/V1.jpg' },
        { id: 2, name: 'Robe Courte', price: 99, image: '/assets/V5.PNG' },
        { id: 3, name: 'Mini Djellaba', price: 60, image: '/assets/V10.PNG' },
        { id: 4, name: 'Pantalon femme', price: 30, image: '/assets/V9.PNG' },
      ],
    },
    {
      name: 'Accessoires',
      products: [
        { id: 5, name: 'Sac Cuire', price: 79, image: '/assets/V12.jpg' },
        { id: 6, name: 'Collie', price: 349, image: '/assets/V13.jpg' },
        { id: 7, name: 'Chasseurs Talonts', price: 80, image: '/assets/V14.jpg' },
      ],
    },
    {
      name: 'Maison',
      products: [
        { id: 8, name: 'Zarbia', price: 299, image: '/assets/V18.PNG' },
        { id: 9, name: 'Objets décoratifs vintage', price: 167, image: '/assets/V19.PNG' },
        { id: 10, name: 'KHALAT', price: 50, image: '/assets/V20.PNG' },
      ],
    },
    {
      name: 'Électroniques',
      products: [
        { id: 11, name: 'Camera HD', price: 500, image: '/assets/V21.PNG' },
        { id: 12, name: 'PC gamer', price: 4000, image: '/assets/V22.PNG' },
      ],
    },
    {
      name: 'Jeux',
      products: [
        { id: 13, name: 'Piano électrique', price: 389, image: '/assets/V22.PNG' },
      ],
    },
  ];

  // ===================== GETTERS =====================
  get vetementAccessoireProducts() {
    return this.categories
      .filter(c => c.name === 'Vêtements' || c.name === 'Accessoires')
      .flatMap(c => c.products);
  }

  get vetementAccessoireLoop() {
    return [...this.vetementAccessoireProducts, ...this.vetementAccessoireProducts];
  }

  get maisonElectroJeuxProducts() {
    return this.categories
      .filter(c =>
        c.name === 'Maison' ||
        c.name === 'Électroniques' ||
        c.name === 'Jeux'
      )
      .flatMap(c => c.products);
  }

  get maisonElectroJeuxLoop() {
    return [...this.maisonElectroJeuxProducts, ...this.maisonElectroJeuxProducts];
  }

  goToProduct(product: any) {
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

  private coverInterval!: any;

  ngOnInit() {
    // Trigger hero animation after a short delay
    setTimeout(() => {
      this.heroAnimated = true;
    }, 100);

    this.coverInterval = setInterval(() => {
      this.rotateCoverflow();
    }, 2500);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        // Petit délai pour laisser le DOM se stabiliser
        setTimeout(() => {
          this.initScrollAnimations();
        }, 200);
      });
    }
  }

  /**
   * Initialise les animations scroll-trigger pour toutes les sections
   */
  private initScrollAnimations(): void {
    // Animation pour les cards promotionnelles
    gsap.utils.toArray('.promo-card').forEach((card: any) => {
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
    gsap.utils.toArray('.products-section').forEach((section: any) => {
      const heading = section.querySelector('.section-heading');
      const scrollContainer = section.querySelector('.scroll-container');

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
    const vendeurSection = document.querySelector('.vendeur-section');
    if (vendeurSection) {
      const leftContent = vendeurSection.querySelector('.vendeur-left');
      const rightContent = vendeurSection.querySelector('.vendeur-right');

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
    gsap.utils.toArray('.why-card').forEach((card: any, index: number) => {
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
    gsap.utils.toArray('.section-title').forEach((title: any) => {
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

  rotateCoverflow() {
    // 🔥 الطريقة الصحيحة مع Angular
    this.expertiseCards = [
      ...this.expertiseCards.slice(1),
      this.expertiseCards[0],
    ];
  }

  ngOnDestroy() {
    clearInterval(this.coverInterval);
    // Clean up all ScrollTrigger instances
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }
}