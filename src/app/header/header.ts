import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CartService } from '../services/cart.service';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  /* ================= FIXED HEADER ================= */
  @Input() fixed = false;

  /* ================= MENU TOGGLE ================= */
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  /* ================= CART COUNT ================= */
  readonly cartItemsCount$: Observable<number>;

  /* ================= THEME TOGGLE ================= */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  constructor(
    private readonly cartService: CartService,
    public readonly themeService: ThemeService
  ) {
    this.cartItemsCount$ = this.cartService.items$.pipe(
      map(items => this.cartService.getItemsCount(items))
    );
  }
}
