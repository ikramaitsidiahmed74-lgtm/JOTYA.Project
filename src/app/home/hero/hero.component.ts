import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
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
  @ViewChildren('videoCard') videoCards!: QueryList<ElementRef<HTMLVideoElement>>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private rotationTween: gsap.core.Tween | null = null;
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private currentRotation = 0;
  private intersectionObserver: IntersectionObserver | null = null;

  // Vidéos pour le carousel 3D (6 vidéos × 2 = 12 cards)
  readonly VIDEO_FILES: string[] = [
    'Design sans titre (5).mp4',
    'Design sans titre (6).mp4',
    'Design sans titre (7).mp4',
    'Design sans titre (8).mp4',
    'Design sans titre (9).mp4',
    'Design sans titre (10).mp4'
  ];

  // 12 cards: each video appears twice
  readonly VIDEOS: string[] = [
    ...this.VIDEO_FILES,
    ...this.VIDEO_FILES
  ];

  // Images Unsplash pour le carousel 3D (optional backup)
  readonly DATA: string[] = [];

  // Total = 12 video cards
  get totalCards(): number {
    return this.VIDEOS.length;
  }

  // Angle entre chaque carte (360° / nombre de cartes)
  get anglePerCard(): number {
    return 360 / this.totalCards;
  }

  /**
   * Génère l'URL de la vidéo
   */
  getVideoUrl(videoName: string): string {
    return `assets/hero vidio/${videoName}`;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        // Petit délai pour laisser le DOM se stabiliser
        setTimeout(() => {
          this.initCarousel3D();
          this.initLazyLoadVideos();
        }, 100);
      });
    }
  }

  /**
   * Initialize Intersection Observer for lazy loading videos
   */
  private initLazyLoadVideos(): void {
    if (!this.isBrowser) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // Load and play video when visible
            if (video.paused) {
              video.play().catch(() => {});
            }
          } else {
            // Pause video when not visible to save resources
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all video cards
    this.videoCards.forEach((cardRef) => {
      this.intersectionObserver?.observe(cardRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.rotationTween) {
      this.rotationTween.kill();
    }
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
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
