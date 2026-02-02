import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-maison-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="maison"
      categoryLabel="Maison"
      categoryIcon="🏠"
      categoryDescription="Décoration, mobilier et articles pour la maison."
    ></app-base-category>
  `
})
export class MaisonCategoryComponent {}
