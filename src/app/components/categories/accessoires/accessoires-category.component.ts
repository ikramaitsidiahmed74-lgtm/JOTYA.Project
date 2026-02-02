import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-accessoires-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="accessoires"
      categoryLabel="Accessoires"
      categoryIcon="👜"
      categoryDescription="Sacs, ceintures, bijoux et accessoires haut de gamme."
    ></app-base-category>
  `
})
export class AccessoiresCategoryComponent {}
