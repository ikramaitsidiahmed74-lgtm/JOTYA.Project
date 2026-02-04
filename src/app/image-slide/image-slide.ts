import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-image-slide',
  standalone: true,
  imports: [],
  templateUrl: './image-slide.html',
  styleUrl: './image-slide.scss',
})
export class ImageSlide implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  private slider: HTMLElement | null = null;
  private trails: NodeListOf<Element> | null = null;
  private value = 0;
  private trailValue = 0;
  private interval = 4000;
  private intervalId: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.slider = document.querySelector('.slider');
    const trailContainer = document.querySelector('.trail');
    if (trailContainer) {
      this.trails = trailContainer.querySelectorAll('div');
    }

    this.setupEventListeners();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  private trailUpdate(): void {
    if (this.value === 0) {
      this.trailValue = 0;
    } else if (this.value === 20) {
      this.trailValue = 1;
    } else if (this.value === 40) {
      this.trailValue = 2;
    } else if (this.value === 60) {
      this.trailValue = 3;
    } else {
      this.trailValue = 4;
    }
  }

  private setupEventListeners(): void {
    if (!this.isBrowser) return;

    // Navigation buttons
    document.querySelectorAll('svg.next, svg.prev').forEach(cur => {
      cur.addEventListener('click', () => {
        cur.classList.contains('next') ? this.slide('increase') : this.slide('decrease');
      });
    });

    // Trail clicks
    if (this.trails) {
      this.trails.forEach(cur => {
        cur.addEventListener('click', (ev) => this.clickCheck(ev));
      });
    }

    // Touch events
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