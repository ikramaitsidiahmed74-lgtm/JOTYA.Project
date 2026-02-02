import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-construction-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="construction"
      categoryLabel="Construction"
      categoryIcon="🔨"
      categoryDescription="Outils, matériaux et équipements de construction."
    ></app-base-category>
  `
})
export class ConstructionCategoryComponent {}
