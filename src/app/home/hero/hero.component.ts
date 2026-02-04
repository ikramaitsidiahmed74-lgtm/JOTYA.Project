import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit, OnDestroy {
  @Input() logoUrl: string = '/assets/logo.png';

  isLoaded = false;
  showText = false;
  showLogo = false;
  isLogoSticky = false;
  private textTimeout: any;
  private logoTimeout: any;

  // 3D Carousel Data - Unsplash photo IDs
  carouselData = [
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
  
  get carouselCount() {
    return this.carouselData.length;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Step 1: Products appear (immediate)
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);

    // Step 2: Text appears after products (0.8s)
    this.textTimeout = setTimeout(() => {
      this.showText = true;
    }, 800);

    // Step 3: Logo appears last (1.5s)
    this.logoTimeout = setTimeout(() => {
      this.showLogo = true;
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.textTimeout) clearTimeout(this.textTimeout);
    if (this.logoTimeout) clearTimeout(this.logoTimeout);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.showLogo) {
      this.isLogoSticky = window.scrollY > 50;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
