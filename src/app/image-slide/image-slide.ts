import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../services/product.service';

@Component({
  standalone: true,
  selector: 'app-image-slide',
  imports: [CommonModule],
  template: `
	<div class="image-slide" *ngIf="images && images.length">
		<div class="slide">
			<img [src]="images[currentIndex]" [alt]="'Image ' + (currentIndex + 1)" />
		</div>
		<div class="controls">
			<button (click)="prev()" aria-label="Previous">‹</button>
			<span>{{currentIndex + 1}} / {{images.length}}</span>
			<button (click)="next()" aria-label="Next">›</button>
		</div>
		<div class="dots" *ngIf="images.length > 1">
			<button *ngFor="let img of images; let i = index"
				[class.active]="i === currentIndex"
				(click)="goTo(i)"
				[attr.aria-label]="'Go to image ' + (i + 1)">{{i + 1}}</button>
		</div>
	</div>
  `,
  styles: [`
	.image-slide { display:block; text-align:center; }
	.image-slide img { max-width:100%; height:auto; display:inline-block; border-radius:6px; }
	.controls { margin-top:8px; display:flex; align-items:center; justify-content:center; gap:8px; }
	.controls button { padding:4px 8px; }
	.dots { margin-top:8px; }
	.dots button { margin:0 2px; padding:2px 6px; opacity:0.7; }
	.dots button.active { font-weight:bold; opacity:1; }
  `]
})
export class ImageSlide implements OnDestroy {
  @Input() images: string[] = [];
  @Input() products?: Product[]; // optional; if provided we map to image URLs
  @Input() autoplay = false;

  currentIndex = 0;
  private timerId: any = null;

  constructor() {
    // No injection of raw Object or @Inject(Object)
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private ensureImagesFromProducts() {
    if ((!this.images || this.images.length === 0) && this.products && this.products.length) {
      this.images = this.products.map(p => p.imageUrl || (p as any).image || '');
    }
  }

  prev() {
    this.ensureImagesFromProducts();
    if (!this.images?.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.restartTimer();
  }

  next() {
    this.ensureImagesFromProducts();
    if (!this.images?.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.restartTimer();
  }

  goTo(index: number) {
    this.ensureImagesFromProducts();
    if (!this.images?.length) return;
    this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
    this.restartTimer();
  }

  private restartTimer() {
    this.clearTimer();
    if (this.autoplay && this.images && this.images.length > 1) {
      this.timerId = setInterval(() => this.next(), 4000);
    }
  }

  private clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}