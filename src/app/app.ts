import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    Header,
    Footer,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('JOTYA');

  constructor(public router: Router) {}

  isDashboardRoute(): boolean {
    return [
      '/dashboard',
      '/products',
      '/orders',
      '/messages',
      '/settings',
      '/sales',
    ].some((path) => this.router.url.startsWith(path));
  }

  isHomeRoute(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/home');
  }
}
