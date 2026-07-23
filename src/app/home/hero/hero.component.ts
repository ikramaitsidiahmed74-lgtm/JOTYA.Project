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
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private rotationTween: gsap.core.Tween | null = null;
  private heroObserver: IntersectionObserver | null = null;
  private isHeroVisible = true;

  // Vidéos pour le carousel 3D (6 vidéos × 2 = 12 cards)
  readonly VIDEO_FILES: string[] = [
    'Design sans titre (5).mp4',
    'Design sans titre (6).mp4',
    'Design sans titre (7).mp4',
    'Design sans titre (8).mp4',
    'Design sans titre (9).mp4',
    'Design sans titre (10).mp4'
  ];

  // 12 cards - chaque vidéo apparaît 2 fois, réparties pour éviter les doublons côte à côte
  readonly VIDEOS: string[] = [
    'Design sans titre (5).mp4',
    'Design sans titre (7).mp4',
    'Design sans titre (9).mp4',
    'Design sans titre (6).mp4',
    'Design sans titre (8).mp4',
    'Design sans titre (10).mp4',
    'Design sans titre (5).mp4',
    'Design sans titre (8).mp4',
    'Design sans titre (6).mp4',
    'Design sans titre (9).mp4',
    'Design sans titre (7).mp4',
    'Design sans titre (10).mp4'
  ];

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
        requestAnimationFrame(() => {
          this.initCarousel3D();
          this.initHeroVisibilityObserver();
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.rotationTween) {
      this.rotationTween.kill();
    }
    if (this.heroObserver) {
      this.heroObserver.disconnect();
    }
    // Pause all videos on destroy (browser only)
    if (this.isBrowser) {
      this.videoElements?.forEach(v => {
        const el = v.nativeElement;
        if (el && typeof el.pause === 'function') {
          el.pause();
          el.removeAttribute('src');
          el.load();
        }
      });
    }
  }

  /**
   * Observe hero section visibility to pause/resume animations & videos when off-screen
   */
  private initHeroVisibilityObserver(): void {
    if (!this.heroSectionRef?.nativeElement) return;

    this.heroObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible === this.isHeroVisible) return;

        this.isHeroVisible = isVisible;

        if (isVisible) {
          // Resume GSAP animation
          this.rotationTween?.resume();
          // Resume all videos
          this.videoElements?.forEach(v => {
            v.nativeElement.play().catch(() => {});
          });
        } else {
          // Pause GSAP animation when hero is off-screen
          this.rotationTween?.pause();
          // Pause all videos to free GPU/CPU
          this.videoElements?.forEach(v => v.nativeElement.pause());
        }
      },
      { threshold: 0, rootMargin: '100px' }
    );

    this.heroObserver.observe(this.heroSectionRef.nativeElement);
  }

  /**
   * Calcule le style 3D pour chaque carte
   */
  getCardStyle(index: number): { [key: string]: string } {
    const angle = index * this.anglePerCard;
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
      this.rotationTween.timeScale(0.2);
    }
  }

  onMouseLeave(): void {
    if (this.rotationTween) {
      this.rotationTween.timeScale(1);
    }
  }

  /**
   * Initialise le carousel 3D avec GSAP
   */
  private initCarousel3D(): void {
    if (!this.carouselRef?.nativeElement) return;

    const carousel = this.carouselRef.nativeElement;
    const cards = carousel.querySelectorAll('.hero-card');

    // Animation d'entrée simple
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out'
      }
    );

    // Rotation continue with force3D for GPU compositing
    this.rotationTween = gsap.to(carousel, {
      rotateY: '+=360',
      duration: 40,
      repeat: -1,
      ease: 'none',
      force3D: true
    });
  }
}
