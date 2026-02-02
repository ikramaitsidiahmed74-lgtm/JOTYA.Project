import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-vetement',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="vetement"
      categoryLabel="Vêtements"
      categoryIcon="👔"
      categoryDescription="Catalogue vêtements basé sur les images locales."
    ></app-base-category>
  `
})
export class VetementComponent {}
