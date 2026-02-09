import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSlideComponent } from '../components/image-slide/image-slide.component';
import { ProductService, Product } from '../services/product.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ImageSlideComponent],
  template: `
	<section class="home">
		<h1>Accueil</h1>
		<app-image-slide [images]="heroImages" [autoplay]="true"></app-image-slide>

		<!-- ...other home content... -->
		<div class="featured">
			<h2>Produits récents</h2>
			<ul>
				<li *ngFor="let p of featured">{{p.name}} — {{p.price}}€</li>
			</ul>
		</div>
	</section>
  `,
  styles: [`
	.home { padding:16px; }
	.featured { margin-top:16px; }
  `]
})
export class HomeComponent implements OnInit {
  heroImages: string[] = [];
  featured: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    const products = this.productService.getProducts();
    // pick first up to 6 product images for hero
    this.heroImages = products.slice(0, 6).map(p => p.imageUrl || (p as any).image || '');
    this.featured = products.slice(0, 6);
  }
}
