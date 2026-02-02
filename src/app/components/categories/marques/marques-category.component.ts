import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-marques-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="marques"
      categoryLabel="Marques"
      categoryIcon="⭐"
      categoryDescription="Les plus grandes marques de luxe et de prestige."
    ></app-base-category>
  `
})
export class MarquesCategoryComponent {}
