# 🎨 JOTYA Catalogue Animations Module

Module d'animations Angular réutilisable pour tous les catalogues e-commerce JOTYA.

## 📦 Installation

Les fichiers sont déjà créés dans `src/app/shared/animations/`:
- `catalogue.animations.ts` - Toutes les animations
- `catalogue-animations.module.ts` - Module Angular optionnel
- `catalogue.animations.examples.ts` - Exemples d'utilisation

## 🚀 Quick Start

### Méthode 1: Import direct dans un composant standalone

```typescript
import { Component } from '@angular/core';
import { 
  cardHoverAnimation, 
  imageParallaxAnimation 
} from './shared/animations/catalogue.animations';

@Component({
  selector: 'app-product-card',
  standalone: true,
  animations: [cardHoverAnimation, imageParallaxAnimation],
  template: `
    <div [@cardHover]="hoverState">
      <!-- contenu -->
    </div>
  `
})
export class ProductCardComponent {
  hoverState: 'idle' | 'hover' = 'idle';
}
```

### Méthode 2: Import de toutes les animations

```typescript
import { CATALOGUE_ANIMATIONS } from './shared/animations/catalogue.animations';

@Component({
  animations: CATALOGUE_ANIMATIONS
})
```

## 🎯 Animations Disponibles

### 1️⃣ Card Hover Animation
**Trigger:** `[@cardHover]`  
**States:** `'idle'` | `'hover'`

Animation subtile au survol des cartes produits.

```html
<article [@cardHover]="hoverState" (mouseenter)="hoverState='hover'" (mouseleave)="hoverState='idle'">
  <!-- contenu carte -->
</article>
```

```typescript
hoverState: 'idle' | 'hover' = 'idle';
```

### 2️⃣ Image Parallax Animation
**Trigger:** `[@imageParallax]`  
**States:** `'idle'` | `'hover'`

Effet parallaxe sur les images à l'intérieur des cartes.

```html
<img [@imageParallax]="parallaxState" [src]="imageUrl" />
```

### 3️⃣ Glow Animation
**Trigger:** `[@glow]`  
**States:** `'idle'` | `'active'`

Effet de lueur/ombre avec gradient animé.

```html
<div [@glow]="glowState">
  <!-- élément avec glow -->
</div>
```

### 4️⃣ Pulse Glow (Alternative)
**Trigger:** `[@pulseGlow]`  
**States:** Auto (pulse continu)

Effet "breathing" automatique.

```html
<div [@pulseGlow]="true">
  <!-- élément qui pulse -->
</div>
```

### 5️⃣ Flip Animation
**Trigger:** `[@flip]`  
**States:** `'idle'` | `'hover'`

Rotation 3D subtile de 5° sur l'axe Y.

```html
<div [@flip]="flipState">
  <!-- contenu avec effet flip -->
</div>
```

### 6️⃣ Stagger Fade In
**Trigger:** `[@staggerFadeIn]`  
**States:** Automatique sur changement

Animation d'apparition en cascade pour les listes.

```html
<div class="grid" [@staggerFadeIn]="products.length">
  <div *ngFor="let product of products">
    <!-- carte produit -->
  </div>
</div>
```

### 7️⃣ Stagger Slide In
**Trigger:** `[@staggerSlideIn]`  
**States:** Automatique sur changement

Slide depuis la gauche en cascade.

```html
<div [@staggerSlideIn]="items.length">
  <div *ngFor="let item of items">
    <!-- item -->
  </div>
</div>
```

### 8️⃣ Category Transition
**Trigger:** `[@categoryTransition]`  
**States:** Change avec categoryId

Transition fluide entre catégories.

```html
<div [@categoryTransition]="selectedCategoryId">
  <div *ngFor="let product of filteredProducts">
    <!-- produits filtrés -->
  </div>
</div>
```

### 9️⃣ List Item Animation
**Trigger:** `[@listItem]`  
**States:** Auto `:enter` / `:leave`

Animation pour items de liste individuels.

```html
<li *ngFor="let item of items" [@listItem]>
  {{ item.name }}
</li>
```

### 🔟 Button Press Animation
**Trigger:** `[@buttonPress]`  
**States:** `'idle'` | `'pressed'`

Animation au clic sur les boutons.

```html
<button 
  [@buttonPress]="buttonState"
  (mousedown)="buttonState='pressed'"
  (mouseup)="buttonState='idle'"
>
  Cliquez-moi
</button>
```

## 🎨 Exemple Complet: Product Card

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  cardHoverAnimation,
  imageParallaxAnimation,
  glowAnimation,
  flipAnimation,
  AnimationState,
  DEFAULT_ANIMATION_STATE
} from './shared/animations/catalogue.animations';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="bg-white rounded-lg border overflow-hidden cursor-pointer"
      [@cardHover]="animState.cardHover"
      [@flip]="animState.flip"
      [@glow]="animState.glow"
      (mouseenter)="onHover()"
      (mouseleave)="onLeave()"
    >
      <div class="relative overflow-hidden">
        <img
          [src]="product.imageUrl"
          [@imageParallax]="animState.imageParallax"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="p-4">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} MAD</p>
      </div>
    </article>
  `,
  animations: [
    cardHoverAnimation,
    imageParallaxAnimation,
    glowAnimation,
    flipAnimation
  ]
})
export class ProductCardComponent {
  @Input() product: any;
  
  animState: AnimationState = { ...DEFAULT_ANIMATION_STATE };

  onHover() {
    this.animState.cardHover = 'hover';
    this.animState.imageParallax = 'hover';
    this.animState.flip = 'hover';
    this.animState.glow = 'active';
  }

  onLeave() {
    this.animState.cardHover = 'idle';
    this.animState.imageParallax = 'idle';
    this.animState.flip = 'idle';
    this.animState.glow = 'idle';
  }
}
```

## 🎨 Exemple: Catalogue avec Transitions

```typescript
import { Component } from '@angular/core';
import { CATALOGUE_ANIMATIONS } from './shared/animations/catalogue.animations';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  template: `
    <!-- Navigation catégories -->
    <nav>
      <button 
        *ngFor="let cat of categories"
        [@listItem]
        (click)="selectCategory(cat.id)"
      >
        {{ cat.label }}
      </button>
    </nav>

    <!-- Grille avec transition entre catégories -->
    <div 
      class="grid grid-cols-3 gap-6"
      [@categoryTransition]="selectedCategory"
    >
      <app-product-card
        *ngFor="let product of filteredProducts"
        [product]="product"
      />
    </div>
  `,
  animations: CATALOGUE_ANIMATIONS
})
export class CatalogueComponent {
  categories = [
    { id: 'vetements', label: 'Vêtements' },
    { id: 'maison', label: 'Maison' },
  ];
  
  selectedCategory = 'vetements';
  
  selectCategory(id: string) {
    this.selectedCategory = id;
  }
  
  get filteredProducts() {
    return this.products.filter(p => p.category === this.selectedCategory);
  }
}
```

## ⚡ Optimisations Performance

### 1. Utiliser trackBy dans *ngFor
```typescript
trackByProductId(index: number, product: any): any {
  return product.id;
}
```

```html
<div *ngFor="let product of products; trackBy: trackByProductId">
```

### 2. Activer BrowserAnimationsModule
Dans `app.config.ts`:
```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // ... autres providers
  ]
};
```

### 3. Désactiver les animations (accessibilité)
Dans `styles.css`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🎯 Compatibilité avec Tailwind

Les animations Angular sont **100% compatibles** avec vos classes Tailwind existantes:

- ✅ `hover:shadow-2xl` fonctionne avec `[@cardHover]`
- ✅ `transition-all duration-300` coexiste avec les animations
- ✅ `group-hover:scale-110` reste fonctionnel

**Les animations Angular ajoutent** des effets supplémentaires sans casser vos styles existants.

## 🔧 Personnalisation

### Modifier les timings
```typescript
export const cardHoverAnimation = trigger('cardHover', [
  transition('idle <=> hover', [
    animate('500ms ease-in-out') // Au lieu de 280ms
  ]),
]);
```

### Ajouter des états
```typescript
export const customAnimation = trigger('custom', [
  state('state1', style({ ... })),
  state('state2', style({ ... })),
  state('state3', style({ ... })),
  transition('* => *', animate('300ms'))
]);
```

## 📊 Animations par Composant Recommandées

### Product Card
- `cardHoverAnimation`
- `imageParallaxAnimation`
- `glowAnimation` (optionnel)
- `flipAnimation` (optionnel)

### Catalogue Grid
- `staggerFadeIn` sur le conteneur
- `categoryTransition` pour les changements de catégorie

### Navigation
- `listItemAnimation` sur les items de menu
- `buttonPress` sur les boutons

### Loading States
- `skeletonPulse` sur les placeholders

## 🐛 Troubleshooting

### Animations ne fonctionnent pas
1. Vérifier que `provideAnimations()` est dans `app.config.ts`
2. Vérifier les imports dans le composant
3. S'assurer que les états sont correctement définis

### Performance lente
1. Utiliser `trackBy` dans `*ngFor`
2. Limiter le nombre d'animations simultanées
3. Utiliser `ChangeDetectionStrategy.OnPush`

### Conflit avec Tailwind
Les animations Angular ne devraient **pas** entrer en conflit avec Tailwind.
Si c'est le cas, vérifiez que vous n'avez pas de classes CSS qui écrasent les transforms.

## 📝 License

MIT - JOTYA Project 2026

## 🤝 Contribution

Pour ajouter une nouvelle animation, modifiez `catalogue.animations.ts` et ajoutez-la à `CATALOGUE_ANIMATIONS`.
