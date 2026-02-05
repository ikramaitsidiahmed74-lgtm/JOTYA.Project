import { Component, AfterViewInit, OnDestroy, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-image-slide',
  imports: [],
  templateUrl: './image-slide.html',
  styleUrl: './image-slide.scss',
})
export class ImageSlide implements AfterViewInit, OnDestroy {
  @ViewChild('.slider', { read: ElementRef }) slider!: ElementRef;
  @ViewChildren('.trail div') trailElements!: QueryList<ElementRef>;

  private value: number = 0;
  private trailValue: number = 0;
  private interval: number = 4000;
  private autoplayInterval: any;
  private tl: gsap.core.Timeline | null = null;
  private gsapContext: any = null;
  private touchState = { start: 0, move: 0, change: 0, sliderWidth: 0 };

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initSlider();
  }

  ngOnDestroy(): void {
    this.clearAutoplay();
    if (this.gsapContext && this.gsapContext.revert) {
      this.gsapContext.revert();
    }
    if (this.tl) {
      this.tl.kill();
    }
  }

  private initSlider(): void {
    this.initGsapAnimation();
    this.startAutoplay();
    this.attachNavigation();
    this.attachTrailEvents();
    this.attachTouchEvents();
  }

  private initGsapAnimation(): void {
    // create an initial empty context scoped to the component root
    this.gsapContext = gsap.context(() => {}, this.el.nativeElement);
    // animate the initial active slide
    this.animateSlide(this.trailValue);
  }

  private slide(condition: 'increase' | 'decrease'): void {
    this.clearAutoplay();
    condition === 'increase' ? this.increaseSlide() : this.decreaseSlide();
    this.move(this.value, this.trailValue);
    this.animate();
    this.startAutoplay();
  }

  private increaseSlide(): void {
    this.removeActiveTrail();
    this.value === 80 ? (this.value = 0) : (this.value += 20);
    this.updateTrailValue();
  }

  private decreaseSlide(): void {
    this.removeActiveTrail();
    this.value === 0 ? (this.value = 80) : (this.value -= 20);
    this.updateTrailValue();
  }

  private move(value: number, trailIndex: number): void {
    if (this.slider) {
      this.slider.nativeElement.style.transform = `translateX(-${value}%)`;
    }
    if (this.trailElements && this.trailElements.length > trailIndex) {
      this.trailElements.toArray()[trailIndex].nativeElement.classList.add('active');
    }
  }

  private animate(): void {
    this.animateSlide(this.trailValue);
  }

  private animateSlide(index: number): void {
    // revert previous slide-scoped context (kills previous animations)
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
      this.tl.from(slide.querySelector('.bg') as HTMLElement, { x: '-100%', opacity: 0 })
        .from(slide.querySelector('p') as HTMLElement, { opacity: 0 }, '-=0.3')
        .from(slide.querySelector('h1') as HTMLElement, { opacity: 0, y: '30px' }, '-=0.3')
        .from(slide.querySelector('button') as HTMLElement, { opacity: 0, y: '-40px' }, '-=0.8');
    }, slide);
  }

  private updateTrailValue(): void {
    this.trailValue = Math.floor(this.value / 20);
  }

  private removeActiveTrail(): void {
    if (this.trailElements) {
      this.trailElements.forEach((el) => el.nativeElement.classList.remove('active'));
    }
  }

  private startAutoplay(): void {
    this.autoplayInterval = setInterval(() => this.slide('increase'), this.interval);
  }

  private clearAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  private attachNavigation(): void {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      svg.addEventListener('click', () => {
        svg.classList.contains('next') ? this.slide('increase') : this.slide('decrease');
      });
    });
  }

  private attachTrailEvents(): void {
    if (this.trailElements) {
      this.trailElements.forEach((el) => {
        el.nativeElement.addEventListener('click', (ev: Event) => this.onTrailClick(ev));
      });
    }
  }

  private onTrailClick(e: Event): void {
    this.clearAutoplay();
    this.removeActiveTrail();
    const target = e.target as HTMLElement;
    target.classList.add('active');

    const boxClasses = ['box1', 'box2', 'box3', 'box4', 'box5'];
    this.value = boxClasses.findIndex((cls) => target.classList.contains(cls)) * 20;
    
    this.updateTrailValue();
    this.move(this.value, this.trailValue);
    this.animate();
    this.startAutoplay();
  }

  private attachTouchEvents(): void {
    if (this.slider) {
      const sliderEl = this.slider.nativeElement;
      sliderEl.addEventListener('touchstart', (e: TouchEvent) => this.onTouchStart(e));
      sliderEl.addEventListener('touchmove', (e: TouchEvent) => this.onTouchMove(e));
      sliderEl.addEventListener('touchend', (e: TouchEvent) => this.onTouchEnd(e));
    }
  }

  private onTouchStart(e: TouchEvent): void {
    this.touchState.start = e.touches[0].clientX;
    if (this.slider) {
      this.touchState.sliderWidth = this.slider.nativeElement.clientWidth / 5;
    }
  }

  private onTouchMove(e: TouchEvent): void {
    e.preventDefault();
    this.touchState.move = e.touches[0].clientX;
    this.touchState.change = this.touchState.start - this.touchState.move;
  }

  private onTouchEnd(e: TouchEvent): void {
    if (this.touchState.change > this.touchState.sliderWidth / 4) {
      this.slide('increase');
    } else if (this.touchState.change * -1 > this.touchState.sliderWidth / 4) {
      this.slide('decrease');
    }
    this.touchState = { start: 0, move: 0, change: 0, sliderWidth: 0 };
  }
}