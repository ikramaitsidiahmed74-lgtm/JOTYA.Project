# 📦 Installation du Module Animations

## ⚠️ PRÉREQUIS: Installer @angular/animations

Le package `@angular/animations` n'est pas installé par défaut dans votre projet.

### Commande d'installation:

```bash
npm install @angular/animations@^21.0.0
```

OU avec la même version que vos autres packages Angular:

```bash
npm install @angular/animations@latest
```

### Vérification après installation:

Le package devrait apparaître dans votre `package.json`:

```json
"dependencies": {
  "@angular/animations": "^21.0.0",
  "@angular/common": "^21.0.0",
  ...
}
```

## 🚀 Configuration dans app.config.ts

Après installation, activez les animations dans votre configuration Angular:

**Fichier:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(), // ✅ Ajouter cette ligne
    // ... vos autres providers
  ]
};
```

## ✅ Vérification que tout fonctionne

1. **Installer le package:**
   ```bash
   npm install @angular/animations@^21.0.0
   ```

2. **Redémarrer le serveur de développement:**
   ```bash
   ng serve
   ```

3. **Vérifier qu'il n'y a pas d'erreurs de compilation**

4. **Tester une animation simple:**
   ```typescript
   import { cardHoverAnimation } from './shared/animations/catalogue.animations';
   
   @Component({
     animations: [cardHoverAnimation]
   })
   ```

## 🔧 Alternative: BrowserAnimationsModule (pour modules non-standalone)

Si vous utilisez des modules Angular classiques (non-standalone), vous pouvez aussi importer:

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    // ...
  ]
})
```

Mais avec Angular 21 et les composants standalone, **`provideAnimations()`** est la méthode recommandée.

## 📊 Récapitulatif

- [x] Installer `@angular/animations`
- [x] Ajouter `provideAnimations()` dans `app.config.ts`
- [x] Redémarrer `ng serve`
- [x] Les animations sont prêtes à l'emploi !

## 🐛 Troubleshooting

### Erreur: "Cannot find module '@angular/animations'"
**Solution:** Exécutez `npm install @angular/animations`

### Erreur: "provideAnimations is not a function"
**Solution:** Vérifiez que vous importez depuis `@angular/platform-browser/animations`

### Les animations ne se déclenchent pas
**Solution:** 
1. Vérifiez que `provideAnimations()` est bien dans `app.config.ts`
2. Vérifiez que les animations sont dans le décorateur `@Component`
3. Vérifiez que les états sont correctement liés dans le template

## 📝 Commandes Complètes

```bash
# 1. Installer le package
npm install @angular/animations@^21.0.0

# 2. Vérifier l'installation
npm list @angular/animations

# 3. Redémarrer le serveur
ng serve --port 4300

# 4. Vérifier qu'il n'y a pas d'erreurs
# Ouvrir http://localhost:4300 dans le navigateur
```

## 🎉 C'est tout !

Une fois `@angular/animations` installé et `provideAnimations()` ajouté, tous les fichiers d'animation créés fonctionneront sans modifications supplémentaires.
