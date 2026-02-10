import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { SidebarAdminComponent } from '../components/sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: [],
})
export class AdminLayoutComponent {
  title = "Vue d'ensemble";
  searchPlaceholder = 'Rechercher';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let child = this.activatedRoute as ActivatedRoute;
      while (child.firstChild) {
        child = child.firstChild;
      }
      const data = child.snapshot.data || {};
      this.title = (data['title'] as string) || "Vue d'ensemble";
      // set a simple dynamic placeholder based on title
      const t = this.title.toLowerCase();
      if (t.includes('utilis')) {
        this.searchPlaceholder = 'Rechercher un utilisateur';
      } else if (t.includes('commande') || t.includes('commandes')) {
        this.searchPlaceholder = 'Rechercher une commande';
      } else if (t.includes('validation') || t.includes('produit')) {
        this.searchPlaceholder = 'Rechercher un produit';
      } else {
        this.searchPlaceholder = 'Rechercher';
      }
    });
  }
}