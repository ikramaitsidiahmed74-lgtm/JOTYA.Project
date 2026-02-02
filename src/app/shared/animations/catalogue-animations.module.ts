/**
 * 🎨 JOTYA Animations Module (Optional)
 * 
 * Module Angular optionnel qui exporte toutes les animations
 * Utile si vous préférez importer un module plutôt que les animations individuelles
 * 
 * Usage:
 * import { CatalogueAnimationsModule } from './shared/animations/catalogue-animations.module';
 * 
 * @Component({
 *   imports: [CatalogueAnimationsModule, ...]
 * })
 */

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Ce module peut être importé dans vos composants standalone
 * ou dans votre AppModule principal
 */
@NgModule({
  imports: [
    BrowserAnimationsModule
  ],
  exports: [
    BrowserAnimationsModule
  ]
})
export class CatalogueAnimationsModule {}

/**
 * 📦 BARREL EXPORT
 * Export toutes les animations et helpers depuis un seul fichier
 */
export * from './catalogue.animations';
