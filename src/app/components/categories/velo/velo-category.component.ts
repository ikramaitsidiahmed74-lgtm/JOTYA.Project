import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-velo-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="velo"
      categoryLabel="Vélo"
      categoryIcon="🚲"
      categoryDescription="Vélos, accessoires et équipements cyclistes."
    ></app-base-category>
  `
})
export class VeloCategoryComponent {}
