import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-vetements-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="vetements"
      categoryLabel="Vêtements"
      categoryIcon="👔"
      categoryDescription="Découvrez notre sélection de vêtements de luxe et de créateurs."
    ></app-base-category>
  `
})
export class VetementsCategoryComponent {}
