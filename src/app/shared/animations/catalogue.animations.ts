/**
 * JOTYA E-Commerce - Catalogue Animations Module
 * 
 * Module d'animations Angular réutilisable pour tous les catalogues
 * Compatible avec Tailwind CSS et optimisé pour les performances
 * 
 * @module CatalogueAnimations
 * @version 1.0.0
 */

import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  keyframes,
  group,
  animateChild,
} from '@angular/animations';

/**
 * 1️⃣ HOVER MICRO-INTERACTIONS
 * Animation subtile au survol des cartes produits
 * - Légère élévation (scale: 1.02)
 * - Translation vers le haut (-4px)
 * - Shadow enhancement (déjà géré par Tailwind, on ajoute juste le mouvement)
 */
export const cardHoverAnimation = trigger('cardHover', [
  state('idle', style({
    transform: 'translateY(0) scale(1)',
  })),
  state('hover', style({
    transform: 'translateY(-4px) scale(1.02)',
  })),
  transition('idle <=> hover', [
    animate('280ms cubic-bezier(0.4, 0, 0.2, 1)')
  ]),
]);

/**
 * 2️⃣ PARALLAX EFFECT ON IMAGES
 * Effet parallaxe sur les images à l'intérieur des cartes
 * L'image bouge légèrement dans la direction opposée au survol
 */
export const imageParallaxAnimation = trigger('imageParallax', [
  state('idle', style({
    transform: 'scale(1) translateY(0)',
  })),
  state('hover', style({
    transform: 'scale(1.08) translateY(-6px)',
  })),
  transition('idle <=> hover', [
    animate('500ms cubic-bezier(0.4, 0, 0.2, 1)')
  ]),
]);

/**
 * 3️⃣ ANIMATED GRADIENT BORDERS
 * Effet de bordure/ombre avec gradient animé
 * Utilisation via [style.boxShadow] binding dans le template
 * Cette animation change subtilement la couleur de l'ombre
 */
export const glowAnimation = trigger('glow', [
  state('idle', style({
    filter: 'drop-shadow(0 0 0px rgba(255, 237, 0, 0))',
  })),
  state('active', style({
    filter: 'drop-shadow(0 0 12px rgba(255, 237, 0, 0.4))',
  })),
  transition('idle <=> active', [
    animate('600ms ease-in-out')
  ]),
]);

/**
 * Animation de gradient pulsant (alternative)
 * Pour usage avec des éléments qui ont besoin d'un effet "breathing"
 */
export const pulseGlow = trigger('pulseGlow', [
  transition('* => *', [
    animate('2000ms ease-in-out', keyframes([
      style({ filter: 'drop-shadow(0 0 0px rgba(255, 237, 0, 0))', offset: 0 }),
      style({ filter: 'drop-shadow(0 0 8px rgba(255, 237, 0, 0.3))', offset: 0.5 }),
      style({ filter: 'drop-shadow(0 0 0px rgba(255, 237, 0, 0))', offset: 1.0 }),
    ]))
  ])
]);

/**
 * 4️⃣ MINIMAL FLIP EFFECT
 * Rotation 3D subtile de 5° sur l'axe Y au survol
 * Donne un effet de profondeur sans être trop agressif
 */
export const flipAnimation = trigger('flip', [
  state('idle', style({
    transform: 'perspective(1000px) rotateY(0deg)',
  })),
  state('hover', style({
    transform: 'perspective(1000px) rotateY(5deg)',
  })),
  transition('idle <=> hover', [
    animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')
  ]),
]);

/**
 * 5️⃣ SCROLL-BASED REVEAL WITH FADE-IN AND SCALE
 * Animation d'apparition des cartes lors du scroll
 * Les cartes apparaissent en cascade (stagger) avec fade-in + scale
 * 
 * Usage: Appliquer sur le conteneur parent des cartes
 */
export const staggerFadeIn = trigger('staggerFadeIn', [
  transition('* => *', [
    query(':enter', [
      style({ 
        opacity: 0, 
        transform: 'translateY(30px) scale(0.95)' 
      }),
      stagger('80ms', [
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0) scale(1)' 
          })
        )
      ])
    ], { optional: true })
  ])
]);

/**
 * Variante: Stagger avec slide depuis la gauche
 */
export const staggerSlideIn = trigger('staggerSlideIn', [
  transition('* => *', [
    query(':enter', [
      style({ 
        opacity: 0, 
        transform: 'translateX(-40px) scale(0.95)' 
      }),
      stagger('60ms', [
        animate('450ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateX(0) scale(1)' 
          })
        )
      ])
    ], { optional: true })
  ])
]);

/**
 * 6️⃣ CATEGORY TRANSITIONS
 * Transition fluide lors du changement de catégorie
 * Fade-out les anciennes cartes, fade-in les nouvelles
 */
export const categoryTransition = trigger('categoryTransition', [
  transition('* => *', [
    group([
      // Fade-out les anciennes cartes
      query(':leave', [
        animate('250ms ease-out', 
          style({ 
            opacity: 0, 
            transform: 'scale(0.95)' 
          })
        )
      ], { optional: true }),
      
      // Fade-in les nouvelles cartes avec stagger
      query(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(20px) scale(0.98)' 
        }),
        stagger('50ms', [
          animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
            style({ 
              opacity: 1, 
              transform: 'translateY(0) scale(1)' 
            })
          )
        ])
      ], { optional: true })
    ])
  ])
]);

/**
 * 🎯 BONUS: List Animations
 * Animation de liste pour les items individuels
 */
export const listItemAnimation = trigger('listItem', [
  transition(':enter', [
    style({ 
      opacity: 0, 
      transform: 'translateX(-20px)' 
    }),
    animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
      style({ 
        opacity: 1, 
        transform: 'translateX(0)' 
      })
    )
  ]),
  transition(':leave', [
    animate('250ms ease-out', 
      style({ 
        opacity: 0, 
        transform: 'translateX(20px)' 
      })
    )
  ])
]);

/**
 * 🎯 BONUS: Route Transition
 * Animation lors du changement de page/catalogue
 */
export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 1
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('200ms ease-out', 
          style({ opacity: 0, transform: 'translateY(-20px)' })
        )
      ], { optional: true }),
      query(':enter', [
        animate('400ms 100ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ], { optional: true })
    ])
  ])
]);

/**
 * 🔥 PERFORMANCE TIP: Skeleton Loading Animation
 * Animation pour les placeholders de chargement
 */
export const skeletonPulse = trigger('skeletonPulse', [
  transition('* => *', [
    animate('1500ms ease-in-out', keyframes([
      style({ opacity: 0.4, offset: 0 }),
      style({ opacity: 0.7, offset: 0.5 }),
      style({ opacity: 0.4, offset: 1.0 }),
    ]))
  ])
]);

/**
 * 🎨 Button Press Animation
 * Animation au clic sur les boutons
 */
export const buttonPress = trigger('buttonPress', [
  transition('* => pressed', [
    animate('100ms ease-out', 
      style({ transform: 'scale(0.95)' })
    )
  ]),
  transition('pressed => *', [
    animate('150ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
      style({ transform: 'scale(1)' })
    )
  ])
]);

/**
 * 📦 EXPORT ALL ANIMATIONS
 * Array pratique pour importer toutes les animations en une fois
 */
export const CATALOGUE_ANIMATIONS = [
  cardHoverAnimation,
  imageParallaxAnimation,
  glowAnimation,
  pulseGlow,
  flipAnimation,
  staggerFadeIn,
  staggerSlideIn,
  categoryTransition,
  listItemAnimation,
  routeTransition,
  skeletonPulse,
  buttonPress,
];

/**
 * 🎯 ANIMATION STATES HELPER
 * Helper pour gérer les états d'animation dans les composants
 */
export interface AnimationState {
  cardHover: 'idle' | 'hover';
  imageParallax: 'idle' | 'hover';
  glow: 'idle' | 'active';
  flip: 'idle' | 'hover';
  buttonPress: 'idle' | 'pressed';
}

/**
 * 🔧 DEFAULT ANIMATION STATE
 */
export const DEFAULT_ANIMATION_STATE: AnimationState = {
  cardHover: 'idle',
  imageParallax: 'idle',
  glow: 'idle',
  flip: 'idle',
  buttonPress: 'idle',
};
