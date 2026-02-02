import { Component } from '@angular/core';
import { BaseCategoryComponent } from '../base-category/base-category.component';

@Component({
  selector: 'app-pieces-uniques-category',
  standalone: true,
  imports: [BaseCategoryComponent],
  template: `
    <app-base-category
      categoryId="pieces-uniques"
      categoryLabel="Pièces Uniques"
      categoryIcon="✨"
      categoryDescription="Pièces uniques et articles de collection de qualité."
    ></app-base-category>
  `
})
export class PiecesUniquesComponent {}
