import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-image-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slide.html',
  styleUrls: ['./image-slide.scss'],
})
export class ImageSlide implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private slider: HTMLElement | null = null;
  private trails: NodeListOf<Element> | null = null;
  private value = 0;
  private trailValue = 0;
  private interval = 4000;
  private intervalId: any = null;
  private tl: gsap.core.Timeline | null = null;
  private gsapContext: any = null;

  constructor(
    private el: ElementRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.slider = this.el.nativeElement.querySelector('.slider');
    const trailContainer = this.el.nativeElement.querySelector('.trail');
    if (trailContainer) {
      this.trails = trailContainer.querySelectorAll('div');
    }

    this.initGsapAnimation();
    this.setupEventListeners();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.gsapContext && this.gsapContext.revert) {
      this.gsapContext.revert();
    }
    if (this.tl) {
      this.tl.kill();
    }
  }

  private initGsapAnimation(): void {
    this.gsapContext = gsap.context(() => {}, this.el.nativeElement);
    this.animateSlide(this.trailValue);
  }

  private startAutoSlide(): void {
    this.intervalId = setInterval(() => this.slide('increase'), this.interval);
  }

  private slide(condition: string): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    condition === 'increase' ? this.initiateINC() : this.initiateDEC();
    this.move(this.value, this.trailValue);
    this.animateSlide(this.trailValue);
    this.intervalId = setInterval(() => this.slide('increase'), this.interval);
  }

  private initiateINC(): void {
    if (!this.trails) return;
    this.trails.forEach(cur => cur.classList.remove('active'));
    this.value === 80 ? this.value = 0 : this.value += 20;
    this.trailUpdate();
  }

  private initiateDEC(): void {
    if (!this.trails) return;
    this.trails.forEach(cur => cur.classList.remove('active'));
    this.value === 0 ? this.value = 80 : this.value -= 20;
    this.trailUpdate();
  }

  private move(s: number, t: number): void {
    if (this.slider) {
      this.slider.style.transform = `translateX(-${s}%)`;
    }
    if (this.trails && this.trails[t]) {
      this.trails[t].classList.add('active');
    }
  }

  private animateSlide(index: number): void {
    if (this.gsapContext && this.gsapContext.revert) {
      this.gsapContext.revert();
    }

    const slides: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('.box');
    const slide = slides && slides[index] ? slides[index] : null;
    if (!slide) {
      return;
    }

    this.gsapContext = gsap.context(() => {
      if (this.tl) {
        this.tl.kill();
        this.tl = null;
      }

      this.tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.inOut' } });
      const bg = slide.querySelector('.bg') as HTMLElement;
      const p = slide.querySelector('p') as HTMLElement;
      const h1 = slide.querySelector('h1') as HTMLElement;
      const button = slide.querySelector('button') as HTMLElement;

      if (bg) this.tl.from(bg, { x: '-100%', opacity: 0 });
      if (p) this.tl.from(p, { opacity: 0 }, '-=0.3');
      if (h1) this.tl.from(h1, { opacity: 0, y: '30px' }, '-=0.3');
      if (button) this.tl.from(button, { opacity: 0, y: '-40px' }, '-=0.8');
    }, slide);
  }

  private trailUpdate(): void {
    this.trailValue = Math.floor(this.value / 20);
  }

  private setupEventListeners(): void {
    if (!this.isBrowser) return;

    this.el.nativeElement.querySelectorAll('svg.next, svg.prev').forEach((cur: Element) => {
      cur.addEventListener('click', () => {
        cur.classList.contains('next') ? this.slide('increase') : this.slide('decrease');
      });
    });

    if (this.trails) {
      this.trails.forEach(cur => {
        cur.addEventListener('click', (ev) => this.clickCheck(ev));
      });
    }

    this.setupTouchEvents();
  }

  private clickCheck(e: Event): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    if (!this.trails) return;
    
    this.trails.forEach(cur => cur.classList.remove('active'));
    const check = e.target as HTMLElement;
    check.classList.add('active');

    if (check.classList.contains('box1')) {
      this.value = 0;
    } else if (check.classList.contains('box2')) {
      this.value = 20;
    } else if (check.classList.contains('box3')) {
      this.value = 40;
    } else if (check.classList.contains('box4')) {
      this.value = 60;
    } else {
      this.value = 80;
    }

    this.trailUpdate();
    this.move(this.value, this.trailValue);
    this.animateSlide(this.trailValue);
    this.intervalId = setInterval(() => this.slide('increase'), this.interval);
  }

  private setupTouchEvents(): void {
    if (!this.slider || !this.trails) return;

    let startX = 0;
    let moveX = 0;
    let change = 0;
    let sliderWidth = 0;

    this.slider.addEventListener('touchstart', (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      sliderWidth = (this.slider?.clientWidth || 0) / (this.trails?.length || 1);
    });

    this.slider.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault();
      moveX = e.touches[0].clientX;
      change = startX - moveX;
    });

    this.slider.addEventListener('touchend', () => {
      if (change > sliderWidth / 4) {
        this.slide('increase');
      } else if (change * -1 > sliderWidth / 4) {
        this.slide('decrease');
      }
      startX = 0;
      moveX = 0;
      change = 0;
      sliderWidth = 0;
    });
  }
}
