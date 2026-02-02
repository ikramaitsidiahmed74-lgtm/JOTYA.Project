import { Routes } from '@angular/router';
import { CatalogueLuxeComponent } from './catalogue-luxe/catalogue-luxe.component';
import { VetementsCategoryComponent } from './components/categories/vetements/vetements-category.component';
import { VetementComponent } from './components/categories/vetement/vetement.component';
import { AccessoiresCategoryComponent } from './components/categories/accessoires/accessoires-category.component';
import { PiecesUniquesComponent } from './components/categories/pieces-uniques/pieces-uniques-category.component';
import { MaisonCategoryComponent } from './components/categories/maison/maison-category.component';
import { ElectroniqueCategoryComponent } from './components/categories/electronique/electronique-category.component';
import { MarquesCategoryComponent } from './components/categories/marques/marques-category.component';
import { VeloCategoryComponent } from './components/categories/velo/velo-category.component';
import { ConstructionCategoryComponent } from './components/categories/construction/construction-category.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalogue-luxe',
    pathMatch: 'full',
  },
  // Route catalogue sans catégorie (affiche tous les produits)
  {
    path: 'catalogue-luxe',
    component: CatalogueLuxeComponent,
  },
  // Route catalogue avec catégorie (filtre par catégorie)
  {
    path: 'catalogue-luxe/:category',
    component: CatalogueLuxeComponent,
  },
  // Route détail produit - NOUVELLE
  {
    path: 'products/:id',
    component: ProductDetailComponent,
  },
  // Routes pour les composants de catégories individuelles
  {
    path: 'categories/vetements',
    component: VetementsCategoryComponent,
  },
  {
    path: 'categories/vetement',
    component: VetementComponent,
  },
  {
    path: 'categories/accessoires',
    component: AccessoiresCategoryComponent,
  },
  {
    path: 'categories/pieces-uniques',
    component: PiecesUniquesComponent,
  },
  {
    path: 'categories/maison',
    component: MaisonCategoryComponent,
  },
  {
    path: 'categories/electronique',
    component: ElectroniqueCategoryComponent,
  },
  {
    path: 'categories/marques',
    component: MarquesCategoryComponent,
  },
  {
    path: 'categories/velo',
    component: VeloCategoryComponent,
  },
  {
    path: 'categories/construction',
    component: ConstructionCategoryComponent,
  },
];
