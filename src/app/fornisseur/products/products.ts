import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  openAdd() {
    this.isEdit = false;
    this.form = {
      id: null,
      name: '',
      price: 0,
      stock: 0,
      status: 'En ligne',
    };
    this.showModal = true;
  }

  openEdit(product: Product) {
    this.isEdit = true;
    this.form = { ...product };
    this.showModal = true;
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
}
