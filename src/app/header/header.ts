import { Component } from '@angular/core';
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
  /**
   * Observable that emits the total number of items in the cart.
   * Used to display the cart badge count.
   */
  readonly cartItemsCount$: Observable<number>;

  constructor(private readonly cartService: CartService) {
    // Create an observable that maps cart items to total count
    this.cartItemsCount$ = this.cartService.items$.pipe(
      map(items => this.cartService.getItemsCount(items))
    );
  }
}
