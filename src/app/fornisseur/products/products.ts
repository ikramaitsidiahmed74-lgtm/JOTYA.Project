import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
}

interface ProductForm {
  id: number | null;
  name: string;
  price: number;
  stock: number;
  status: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
})
export class Products {

  products: Product[] = [
    { id: 1, name: 'Sac cuir', price: 100, stock: 12, status: 'En ligne' },
    { id: 2, name: 'Chaussures sport', price: 200, stock: 5, status: 'En ligne' },
    { id: 3, name: 'Montre de luxe', price: 500, stock: 3, status: 'En ligne' },
  ];

  showModal = false;
  isEdit = false;

  form: ProductForm = {
    id: null,
    name: '',
    price: 0,
    stock: 0,
    status: 'En ligne',
  };

  constructor(private router: Router) {}

  openAdd() {
    // Redirect to the centralized AddProduct page instead of opening the legacy modal
    // Keeps the component intact but removes the old modal flow.
    // Navigation uses the fournisseur route where the new AddProductComponent is registered.
  this.router.navigate(['/dashboard/fournisseur/ajouter-produit']);
  }

  openEdit(product: Product) {
    // Navigate to the AddProduct page in edit mode with a query param for the product id
  this.router.navigate(['/dashboard/fournisseur/ajouter-produit'], { queryParams: { editId: product.id } });
  }

  save() {
    if (this.isEdit && this.form.id !== null) {
      const index = this.products.findIndex(p => p.id === this.form.id);
      this.products[index] = {
        id: this.form.id,
        name: this.form.name,
        price: this.form.price,
        stock: this.form.stock,
        status: this.form.status,
      };
    } else {
      this.products.push({
        id: Date.now(),
        name: this.form.name,
        price: this.form.price,
        stock: this.form.stock,
        status: this.form.status,
      });
    }

    this.showModal = false;
  }

  // Navigate to the centralized AddProduct page.
  // Try '/fournisseur/ajouter-produit' first (preferred), fall back to '/dashboard/fournisseur/ajouter-produit' if route not found.
  goToAddProduct() {
    const preferred = 'fournisseur/ajouter-produit';
    const fallback = 'dashboard/fournisseur/ajouter-produit';

    const allPaths = this.collectRoutePaths(this.router.config || []);
    if (allPaths.includes(preferred)) {
      this.router.navigate(['/fournisseur/ajouter-produit']);
      return;
    }

    // fallback if preferred not found
    if (allPaths.includes(fallback)) {
      this.router.navigate(['/dashboard/fournisseur/ajouter-produit']);
      return;
    }

    // last resort: attempt the dashboard path
    this.router.navigate(['/dashboard/fournisseur/ajouter-produit']);
  }

  private collectRoutePaths(routes: any[], parent = ''): string[] {
    const paths: string[] = [];
    for (const r of routes) {
      const segment = r.path || '';
      const combined = parent ? (segment ? `${parent}/${segment}` : parent) : segment;
      // normalize: remove leading/trailing slashes
      const norm = combined.replace(/^\/+|\/+$/g, '');
      if (norm) paths.push(norm);
      if (r.children && r.children.length) {
        paths.push(...this.collectRoutePaths(r.children, norm));
      }
    }
    return paths;
  }
}
