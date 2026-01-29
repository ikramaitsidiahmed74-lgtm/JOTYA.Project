import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  @Input() fixed = false;

  readonly cartItemsCount$: Observable<number>;

  constructor(private readonly cartService: CartService) {
    this.cartItemsCount$ = this.cartService.items$.pipe(
      map(items => this.cartService.getItemsCount(items))
    );
  }
}
