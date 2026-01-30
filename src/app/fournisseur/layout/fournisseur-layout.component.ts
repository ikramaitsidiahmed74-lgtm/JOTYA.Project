import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../fornisseur/sidebar/sidebar';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-fournisseur-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Footer],
  template: `
    <div class="flex min-h-screen w-full">
      <app-sidebar class="w-64 shrink-0"></app-sidebar>
      <div class="flex flex-col flex-1 min-w-0">
        <main class="flex-1 overflow-y-auto bg-gray-50">
          <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
            <router-outlet></router-outlet>
          </div>
        </main>
        <footer class="bg-white border-t border-gray-300">
          <app-footer></app-footer>
        </footer>
      </div>
    </div>
  `,
})
export class FournisseurLayoutComponent {}
