import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  /* ================= FIXED HEADER ================= */
  @Input() fixed = true;

  /* ================= MENU TOGGLE ================= */
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.cdr.markForCheck();
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.cdr.markForCheck();
  }

  /* ================= CART COUNT ================= */
  readonly cartItemsCount$: Observable<number>;

  /* ================= THEME TOGGLE ================= */
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.cdr.markForCheck();
  }

  constructor(
    private readonly cartService: CartService,
    public readonly themeService: ThemeService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.cartItemsCount$ = this.cartService.items$.pipe(
      map(items => this.cartService.getItemsCount(items))
    );
  }
}