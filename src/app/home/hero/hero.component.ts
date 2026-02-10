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
  private videoObserver: IntersectionObserver | null = null;
  private loadedVideos = new Set<HTMLVideoElement>();

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

  /**
   * Génère le poster (première frame) pour la vidéo
   */
  getVideoPoster(videoName: string): string {
    // Utilise une image placeholder noire
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="%23111"/></svg>';
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.initCarousel3D();
          this.initVideoLazyLoading();
        }, 100);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.rotationTween) {
      this.rotationTween.kill();
    }
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
  }

  /**
   * Initialise le lazy loading des vidéos
   */
  private initVideoLazyLoading(): void {
    // Charger seulement les 4 premières vidéos immédiatement
    const videos = this.videoElements.toArray();
    const initialLoadCount = Math.min(4, videos.length);
    
    // Charger les vidéos initiales avec un délai progressif
    for (let i = 0; i < initialLoadCount; i++) {
      setTimeout(() => {
        this.loadAndPlayVideo(videos[i].nativeElement);
      }, i * 300); // 300ms de délai entre chaque vidéo
    }

    // Charger les autres vidéos progressivement après
    for (let i = initialLoadCount; i < videos.length; i++) {
      setTimeout(() => {
        this.loadAndPlayVideo(videos[i].nativeElement);
      }, 2000 + (i - initialLoadCount) * 500); // Commence après 2s, puis 500ms entre chaque
    }
  }

  /**
   * Charge et joue une vidéo
   */
  private loadAndPlayVideo(video: HTMLVideoElement): void {
    if (this.loadedVideos.has(video)) return;
    
    const dataSrc = video.getAttribute('data-src');
    if (dataSrc) {
      video.src = dataSrc;
      video.load();
      video.play().catch(() => {
        // Ignore les erreurs de lecture (peut arriver si l'utilisateur n'a pas interagi)
      });
      this.loadedVideos.add(video);
    }
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

    // Rotation continue
    this.rotationTween = gsap.to(carousel, {
      rotateY: '+=360',
      duration: 40,
      repeat: -1,
      ease: 'none'
    });
  }
}
