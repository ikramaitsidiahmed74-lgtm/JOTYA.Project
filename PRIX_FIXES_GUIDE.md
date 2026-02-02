# 📋 Guide : Prix Fixes pour les Produits

## ✅ Système Modifié

Le système a été modifié pour accepter des **prix fixes manuels** pour chaque produit.

---

## 🎯 Comment Définir des Prix Fixes

### Fichier : `src/app/services/product.service.ts`

### Exemple 1 : Catalogue VÉLO (Déjà configuré)

```typescript
velo: {
  folder: 'assets/velo',
  images: [
    'endurobike1.PNG',
    'VELO SANTA1.PNG',
    'VELO1.PNG',
    'VELO3.PNG',
    'velo4.PNG',
    'VELO5.PNG',
    'velo6.PNG'
  ],
  defaultPrice: 8500,  // Prix par défaut si non spécifié
  categoryName: 'Vélo',
  productPrices: {     // ← Prix fixes par produit
    'endurobike1.PNG': 12500,   // VTT Enduro Premium
    'VELO SANTA1.PNG': 9800,    // Vélo Santa Cruz
    'VELO1.PNG': 7500,          // VTT Standard
    'VELO3.PNG': 6200,          // Vélo Route
    'velo4.PNG': 8900,          // VTT All-Mountain
    'VELO5.PNG': 11000,         // Vélo Route Carbon
    'velo6.PNG': 5500           // VTT Entry Level
  }
}
```

---

### Exemple 2 : Catalogue VÊTEMENTS

```typescript
vetements: {
  folder: 'assets/vetements',
  images: [
    '07878532805-e2.jpg',
    'd9a97503-da9f-4e98-b957-3bc5ccf819e0.jpeg',
    'JUPE1.PNG',
    'V1.jpg',
    // ... autres images
  ],
  defaultPrice: 199,  // Prix par défaut
  categoryName: 'Vêtements',
  productPrices: {    // ← Prix fixes par produit
    '07878532805-e2.jpg': 250,
    'd9a97503-da9f-4e98-b957-3bc5ccf819e0.jpeg': 180,
    'JUPE1.PNG': 120,
    'V1.jpg': 300,
    'V2.jpg': 280,
    'V3.jpg': 320,
    'V4.PNG': 150,
    'V5.PNG': 170,
    // ... définir pour chaque image
  }
}
```

---

### Exemple 3 : Catalogue MAISON

```typescript
maison: {
  folder: 'assets/maison',
  images: [
    'ACS2.PNG',
    'ACS4.PNG',
    'ACS5.PNG',
    // ... autres images
  ],
  defaultPrice: 299,  // Prix par défaut
  categoryName: 'Maison',
  productPrices: {    // ← Prix fixes par produit
    'ACS2.PNG': 450,
    'ACS4.PNG': 380,
    'ACS5.PNG': 320,
    'ZARBIA2.PNG': 1200,
    'ZARBIA3.PNG': 950,
    'FINJAN2.PNG': 180,
    'KHALATE2.PNG': 420,
    // ... définir pour chaque image
  }
}
```

---

### Exemple 4 : Catalogue ÉLECTRONIQUE

```typescript
electronique: {
  folder: 'assets/electro',
  images: [
    'CAMERA AVEC BAF2.PNG',
    'camera1.PNG',
    'PC1.PNG',
    // ... autres images
  ],
  defaultPrice: 499,  // Prix par défaut
  categoryName: 'Électronique',
  productPrices: {    // ← Prix fixes par produit
    'CAMERA AVEC BAF2.PNG': 2500,
    'camera1.PNG': 1800,
    'PC GAME1 - Copie.PNG': 8500,
    'PC1.PNG': 6500,
    'TELE1.PNG': 4200,
    'TELE3.PNG': 5500,
    'PLS1.PNG': 350,
    'PLS2.PNG': 420,
    // ... définir pour chaque image
  }
}
```

---

## 📝 Règles Importantes

### 1. **Nom exact du fichier**
Le nom dans `productPrices` doit correspondre **exactement** au nom dans la liste `images` :
```typescript
images: ['VELO1.PNG'],        // ← Majuscules
productPrices: {
  'VELO1.PNG': 7500           // ← Même majuscules
}
```

### 2. **Prix en MAD (Dirhams)**
Tous les prix sont en Dirhams marocains (MAD) :
```typescript
'velo6.PNG': 5500  // = 5500 MAD
```

### 3. **defaultPrice comme fallback**
Si un produit n'a pas de prix dans `productPrices`, il utilisera `defaultPrice` :
```typescript
defaultPrice: 8500,
productPrices: {
  'VELO1.PNG': 7500  // ← Utilise 7500
  // 'VELO2.PNG' non défini → utilisera 8500
}
```

---

## 🔄 Modification des Prix

### Changer un prix existant

**Avant :**
```typescript
productPrices: {
  'VELO1.PNG': 7500
}
```

**Après :**
```typescript
productPrices: {
  'VELO1.PNG': 9200  // ← Prix modifié
}
```

### Ajouter un nouveau produit avec prix

```typescript
productPrices: {
  'VELO1.PNG': 7500,
  'VELO_NEW.PNG': 8800  // ← Nouveau produit
}
```

---

## ✅ Avantages du Nouveau Système

1. ✅ **Prix fixes** : Chaque produit a son propre prix défini manuellement
2. ✅ **Pas de variation** : Les prix ne changent pas à chaque rechargement
3. ✅ **Contrôle total** : Vous décidez exactement du prix de chaque produit
4. ✅ **Fallback intelligent** : Si pas de prix spécifié, utilise `defaultPrice`
5. ✅ **Compatible** : Le reste du système fonctionne exactement pareil

---

## 📊 Exemple Complet pour VÉLO

### Résultat dans le Catalogue :

| Image | Nom Produit | Prix Fixe |
|-------|-------------|-----------|
| endurobike1.PNG | Vélo Endurobike1 | 12 500 MAD |
| VELO SANTA1.PNG | Vélo Santa1 | 9 800 MAD |
| VELO1.PNG | Vélo Velo1 | 7 500 MAD |
| VELO3.PNG | Vélo Velo3 | 6 200 MAD |
| velo4.PNG | Vélo Velo4 | 8 900 MAD |
| VELO5.PNG | Vélo Velo5 | 11 000 MAD |
| velo6.PNG | Vélo Velo6 | 5 500 MAD |

---

## 🚀 Application des Changements

1. Modifier `src/app/services/product.service.ts`
2. Sauvegarder le fichier
3. Le serveur Angular recharge automatiquement
4. Les nouveaux prix s'affichent immédiatement

---

## ⚠️ Important

- **Sauvegardez** vos modifications avant de tester
- **Vérifiez** que les noms de fichiers correspondent exactement
- **Testez** dans le navigateur après modification
- Les prix sont **permanents** jusqu'à ce que vous les changiez manuellement

---

## 📞 Support

Pour toute question ou problème, référez-vous à ce guide ou consultez le fichier :
`src/app/services/product.service.ts` lignes 35-170
