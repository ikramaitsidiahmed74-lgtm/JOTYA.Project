import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../shared/notification/notification.service';
import { ConfirmService } from '../../shared/confirm/confirm.service';

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

  products: Product[] = [];
  loadingDelete: { [id: number]: boolean } = {};

  showModal = false;
  isEdit = false;

  form: ProductForm = {
    id: null,
    name: '',
    price: 0,
    stock: 0,
    status: 'En ligne',
  };

  constructor(private router: Router, private productService: ProductService, private notificationService: NotificationService, private confirmService: ConfirmService) {
    // subscribe to reactive products store
    this.productService.products$.subscribe(list => {
      this.products = list.map(p => ({ id: p.id, name: p.name, price: p.price, stock: (p as any).stock ?? 0, status: (p as any).status ?? 'En ligne' }));
    });
  }

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

  async deleteProduct(product: Product) {
    const accepted = await this.confirmService.confirm({ message: `Supprimer le produit "${product.name}" ?`, confirmText: 'Supprimer', cancelText: 'Annuler' });
    if (!accepted) return;
    this.loadingDelete[product.id] = true;
    try {
      // remove from central product service
      this.productService.removeProductFromList(product.id);
      // refresh local list
      this.products = this.productService.getProducts().map(p => ({ id: p.id, name: p.name, price: p.price, stock: (p as any).stock ?? 0, status: (p as any).status ?? 'En ligne' }));
      this.notificationService.success('Produit supprimé');
    } catch (err) {
      console.error('Delete error', err);
      this.notificationService.error('Erreur lors de la suppression');
    } finally {
      this.loadingDelete[product.id] = false;
    }
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
