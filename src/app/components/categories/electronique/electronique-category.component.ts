import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-electronique-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="electronique"
      categoryLabel="Électronique"
      categoryIcon="📱"
      categoryDescription="Smartphones, ordinateurs et appareils électroniques premium."
    ></app-base-category>
  `
})
export class ElectroniqueCategoryComponent {}
