import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  inject,
  NgZone
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carousel3D') carouselRef!: ElementRef<HTMLDivElement>;
  @ViewChild('heroSection') heroSectionRef!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private rotationTween: gsap.core.Tween | null = null;
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private currentRotation = 0;

  // Images Unsplash pour le carousel 3D
  readonly DATA: string[] = [
    '1540968221243-29f5d70540bf',
    '1596135187959-562c650d98bc',
    '1628944682084-831f35256163',
    '1590013330451-3946e83e0392',
    '1590421959604-741d0eec0a2e',
    '1572613000712-eadc57acbecd',
    '1570097192570-4b49a6736f9f',
    '1620789550663-2b10e0080354',
    '1617775623669-20bff4ffaa5c',
    '1548600916-dc8492f8e845',
    '1573824969595-a76d4365a2e6',
    '1633936929709-59991b5fdd72'
  ];

  // +1 pour inclure la video card
  get totalCards(): number {
    return this.DATA.length + 1;
  }

  // Angle entre chaque carte (360° / nombre de cartes)
  get anglePerCard(): number {
    return 360 / this.totalCards;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        // Petit délai pour laisser le DOM se stabiliser
        setTimeout(() => {
          this.initCarousel3D();
        }, 100);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.rotationTween) {
      this.rotationTween.kill();
    }
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
    // Clean up all ScrollTriggers created by this component
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  /**
   * Génère l'URL Unsplash optimisée
   */
  getImageUrl(photoId: string): string {
    return `https://images.unsplash.com/photo-${photoId}?w=400&h=571&fit=crop&auto=format&q=80`;
  }

  /**
   * Calcule le style 3D pour chaque carte
   * Les cartes sont disposées en cercle autour de l'axe Y
   */
  getCardStyle(index: number): { [key: string]: string } {
    const angle = index * this.anglePerCard;
    // Le rayon dépend de la taille de l'écran (géré en CSS)
    return {
      '--angle': `${angle}deg`,
      '--i': index.toString()
    };
  }

  /**
   * Pause/reprise de l'animation au survol
   */
  onMouseEnter(): void {
    if (this.rotationTween) {
      this.rotationTween.timeScale(0.2); // Ralentit fortement
    }
  }

  onMouseLeave(): void {
    if (this.rotationTween) {
      this.rotationTween.timeScale(1); // Reprend vitesse normale
    }
  }

  /**
   * Initialise le carousel 3D avec GSAP + ScrollTrigger
   */
  private initCarousel3D(): void {
    if (!this.carouselRef?.nativeElement) return;

    const carousel = this.carouselRef.nativeElement;
    const cards = carousel.querySelectorAll('.hero-card');
    const heroSection = this.heroSectionRef?.nativeElement;

    // Animation d'entrée pour les cartes avec ScrollTrigger
    gsap.fromTo(
      cards,
      { 
        opacity: 0, 
        scale: 0.5,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: heroSection ? {
          trigger: heroSection,
          start: 'top 80%',
          toggleActions: 'play none none none'
        } : undefined
      }
    );

    // Animation de rotation continue et infinie autour de l'axe Y
    this.rotationTween = gsap.to(carousel, {
      rotateY: '+=360',
      duration: 30, // 30 secondes pour un tour complet
      repeat: -1,   // Infini
      ease: 'none', // Vitesse constante (linéaire)
      onUpdate: () => {
        // Mise à jour de la rotation actuelle pour référence
        this.currentRotation = gsap.getProperty(carousel, 'rotateY') as number;
      }
    });

    // ScrollTrigger pour contrôler la vitesse en fonction du scroll
    if (heroSection) {
      this.scrollTriggerInstance = ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          if (this.rotationTween) this.rotationTween.timeScale(0.5);
        },
        onEnterBack: () => {
          if (this.rotationTween) this.rotationTween.timeScale(1);
        }
      });
    }
  }
}
