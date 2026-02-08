import { Component, signal, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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
export class App implements AfterViewInit {
  protected readonly title = signal('JOTYA');

  constructor(public router: Router) {}

  ngAfterViewInit(): void {
    // 1️⃣ Register GSAP ScrollTrigger plugin once
    gsap.registerPlugin(ScrollTrigger);

    // 2️⃣ Optional: clear all existing ScrollTriggers (helps during hot reload)
    ScrollTrigger.getAll().forEach((st: any) => st.kill());

    // 3️⃣ Example global animation (optional)
    gsap.to('.app-title', {
      y: 20,
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: '.app-title',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    });
  }

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