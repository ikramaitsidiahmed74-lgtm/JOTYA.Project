import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Header } from './header/header';
import { Header2 } from './header2/header2';
import { Footer } from './footer/footer';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    Header,
    Header2,
    Footer,
    Sidebar
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('JOTYA');

  constructor(public router: Router) {}

  // Pages li fihom sidebar (admin)
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

  // Home page (full width)
  isHomeRoute(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/home');
  }
}
