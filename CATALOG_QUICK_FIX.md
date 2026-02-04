# JOTYA Catalog - Quick Fix Guide

**Quick Reference for Most Common Catalog Issues**

---

## 🚀 THE 5-MINUTE FIX

If your catalog doesn't show products, try this in order:

### Step 1: Fresh Install (2 minutes)
```powershell
# Kill any running dev server first
# Then:
cd c:\Users\zakaria\jotya1
npm install
npm start
```

**Expected:** App loads at `http://localhost:4200/catalogue-luxe` with 6 product cards

If this works → **You're done! 🎉**

---

### Step 2: Check Browser Console (1 minute)
Press `F12` or `Ctrl+Shift+I` to open DevTools

**Click Console tab** and look for:
- ❌ Any red error messages?
- ❌ "404" for images?
- ✅ Green checkmarks in logs?

**What you should see:**
```
✅ Produits chargés: 74
✅ Catégories chargées: 10
🔄 Initialisation avec 6 premiers produits
```

If you see different messages → see below

---

### Step 3: Check Network Tab (1 minute)
In DevTools:
1. Click **Network** tab
2. Reload page (F5)
3. Search for `assets` in the filter

**What to look for:**
- All images should show **200 OK** (green)
- If any show **404 Not Found** (red) → Asset path is wrong

**Red 404 error?** → Go to "Solution 1" below

---

### Step 4: Verify Assets Folder (1 minute)
```powershell
# Check if images exist
Test-Path "c:\Users\zakaria\jotya1\src\assets\vetements"
Test-Path "c:\Users\zakaria\jotya1\src\assets\electro"

# Count images
(Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\vetements" -File).Count
```

**Should see:**
- `True` for folder exists
- `26` for vetements count

**No folders or low count?** → Go to "Solution 3" below

---

## 🔧 SOLUTION 1: Fix 404 Image Errors

**Problem:** Images showing broken with 404 error

### Check 1: Verify Image Files Exist
```powershell
# List first 5 images in vetements
Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\vetements" -File | Select-Object -First 5 | Format-Table Name

# Check one specific file
Test-Path "c:\Users\zakaria\jotya1\src\assets\vetements\V1.PNG"
```

### Check 2: Verify Case Sensitivity Match
**Windows:** File system is case-insensitive, but check if files match config

In [src/app/services/product.service.ts](src/app/services/product.service.ts#L45):
```typescript
vetements: {
  folder: 'assets/vetements',  // ← Must match folder name
  images: [
    '07878532805-e2.jpg',  // ← Must match exact filename
    'V1.PNG',              // ← Capital PNG!
    // ... rest
  ],
```

**Compare with actual files:**
```powershell
# Get actual filenames
Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\vetements" | Select-Object Name
```

**If names don't match** → Update the array in product.service.ts

### Check 3: Verify angular.json Assets Config
```bash
# Check if assets folder is included in build
cat angular.json | grep -A5 '"assets"'
```

**Should see:**
```json
"assets": [
  "src/assets",
  "src/favicon.ico"
]
```

**If missing `src/assets`** → Add it:
```json
{
  "projects": {
    "JOTYA": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              "src/assets",  // ← ADD THIS LINE
              "src/favicon.ico"
            ]
          }
        }
      }
    }
  }
}
```

**Then rebuild:**
```bash
npm start
```

---

## 🔧 SOLUTION 2: Fix No Products Displayed (Blank Grid)

**Problem:** Page loads but grid shows placeholder skeleton cards instead of products

### Check 1: Verify Service Loads Data
```powershell
# Open browser DevTools Console (F12)
# Paste this:
```

```javascript
const component = ng.getComponent(document.querySelector('app-catalogue-luxe'));
console.log('Products loaded:', component.products.length);
console.log('Displayed:', component.displayedProducts.length);
console.log('First product:', component.products[0]);
```

**Expected output:**
```
Products loaded: 74
Displayed: 6
First product: {
  id: 1,
  name: "...",
  imageUrl: "assets/vetements/...",
  price: 199,
  ...
}
```

**If products.length is 0?** → Service didn't generate products

### Check 2: Force Regenerate Products
Edit [src/app/services/product.service.ts](src/app/services/product.service.ts#L38):

```typescript
constructor() {
  console.log('🔧 ProductService initializing...');
  this.generateAllProducts();
  console.log('✅ Generated', this.products.length, 'products');
  this.updateCategoryCounts();
}

private generateAllProducts(): void {
  let productId = 1;
  
  for (const [categoryId, config] of Object.entries(this.imageConfigs)) {
    console.log(`Processing ${categoryId}:`, config.images.length, 'images');
    
    const categoryProducts = this.generateProductsFromImages(
      config,
      this.resolveCategoryId(categoryId),
      productId
    );
    
    console.log(`✅ Generated ${categoryProducts.length} for ${categoryId}`);
    this.products.push(...categoryProducts);
    productId += categoryProducts.length;
  }
}
```

**Then check console:**
```powershell
npm start
# Look at console output
```

### Check 3: Verify Image Arrays Not Empty
In [src/app/services/product.service.ts](src/app/services/product.service.ts#L45):

Make sure each category has images array filled:
```typescript
vetements: {
  folder: 'assets/vetements',
  images: [  // ← This array must NOT be empty!
    'image1.png',
    'image2.png',
    // ... should have 26 items
  ],
  defaultPrice: 199,
  categoryName: 'Vêtements'
},
```

If array is empty `images: []` → Fill it with actual filenames

---

## 🔧 SOLUTION 3: Fix Missing Asset Folders

**Problem:** `src/assets` folder doesn't exist or is incomplete

### Create Missing Folders
```powershell
cd c:\Users\zakaria\jotya1\src\assets

# Create folders if missing
mkdir vetements -ErrorAction SilentlyContinue
mkdir electro -ErrorAction SilentlyContinue
mkdir maison -ErrorAction SilentlyContinue
mkdir velo -ErrorAction SilentlyContinue
mkdir construction -ErrorAction SilentlyContinue

# List what you have
Get-ChildItem
```

### Add Images to Folders
**Source:** If you have images elsewhere, copy them:

```powershell
# Example: Copy images from Downloads
Copy-Item "C:\Users\zakaria\Downloads\vetements_images\*" "c:\Users\zakaria\jotya1\src\assets\vetements" -Force
Copy-Item "C:\Users\zakaria\Downloads\electro_images\*" "c:\Users\zakaria\jotya1\src\assets\electro" -Force
```

### Verify Image Count
```powershell
# Should have these counts
(Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\vetements" -File).Count     # Should be 26
(Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\electro" -File).Count       # Should be 11
(Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\maison" -File).Count        # Should be 23
(Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\velo" -File).Count          # Should be 7
(Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\construction" -File).Count  # Should be 6
```

### Update Service Config with Actual Filenames
```bash
# List vetements images
Get-ChildItem "c:\Users\zakaria\jotya1\src\assets\vetements" -File | Select-Object -ExpandProperty Name
```

Copy the output and update [src/app/services/product.service.ts](src/app/services/product.service.ts#L45):

```typescript
vetements: {
  folder: 'assets/vetements',
  images: [
    // Paste the filenames here
    'image1.PNG',
    'image2.PNG',
    // ... etc
  ],
  defaultPrice: 199,
  categoryName: 'Vêtements'
},
```

**Then restart:**
```bash
npm start
```

---

## 🔧 SOLUTION 4: Fix Category Filtering Not Working

**Problem:** Click category in sidebar but products don't filter

### Check 1: Verify Routes Defined
```bash
# Check if routes exist in app.routes.ts
grep -n "catalogue-luxe" src/app/app.routes.ts
```

**Should see:**
```
Line 93: { path: 'catalogue-luxe', component: CatalogueLuxeComponent },
Line 94: { path: 'catalogue-luxe/:category', component: CatalogueLuxeComponent },
```

**Not there?** → Add these to [src/app/app.routes.ts](src/app/app.routes.ts#L93):

```typescript
export const routes: Routes = [
  // ... other routes
  
  // Add these:
  { path: 'catalogue-luxe', component: CatalogueLuxeComponent },
  { path: 'catalogue-luxe/:category', component: CatalogueLuxeComponent },
  
  // ...
];
```

### Check 2: Test Navigation Manually
Open browser console and test:

```javascript
// Navigate to vetements
const router = ng.getComponent(document.querySelector('app-catalogue-luxe')).router;
router.navigate(['/catalogue-luxe/vetements']);

// Check if filtering worked
const component = ng.getComponent(document.querySelector('app-catalogue-luxe'));
setTimeout(() => {
  console.log('Selected category:', component.selectedCategory);
  console.log('Filtered products:', component.filteredProducts.length);
}, 500);
```

**Did selected category change?** → Routes are working

**Stayed empty?** → Check category ID resolution

### Check 3: Verify Category ID Resolution
```typescript
// In console, test the service:
const service = ng.getComponent(document.querySelector('app-catalogue-luxe')).productService;

// Test category normalization
console.log('Resolve vetements:', service.resolveCategoryId('vetements'));
console.log('Resolve vetement:', service.resolveCategoryId('vetement'));
console.log('Resolve Vetements:', service.resolveCategoryId('Vetements'));
```

**Should all output:** `vetements`

If not → Update [src/app/services/product.service.ts](src/app/services/product.service.ts#L264):

```typescript
resolveCategoryId(categoryId: string): string {
  const normalized = categoryId.toLowerCase().trim();
  
  // Handle all variations
  if (normalized === 'vetement') return 'vetements';
  if (normalized === 'accessoire') return 'accessoires';
  if (normalized === 'chaussure') return 'chaussures';
  if (normalized === 'lunette') return 'lunettes';
  
  return normalized;
}
```

---

## 🔧 SOLUTION 5: Fix Pagination Issues

**Problem:** Only showing 1-2 products or pagination broken

### Check 1: Verify itemsPerPage Setting
```javascript
// In console:
const component = ng.getComponent(document.querySelector('app-catalogue-luxe'));
console.log('Items per page:', component.itemsPerPage);
console.log('Total filtered:', component.filteredProducts.length);
console.log('Displayed:', component.displayedProducts.length);
console.log('Total pages:', component.totalPages);
```

**Expected:**
```
Items per page: 6
Total filtered: 74 (or less if filtered)
Displayed: 6 (on page 1)
Total pages: 12 (74 / 6 = 12.33 → 13 pages)
```

**If wrong?** Edit [src/app/catalogue-luxe/catalogue-luxe.component.ts](src/app/catalogue-luxe/catalogue-luxe.component.ts#L49):

```typescript
itemsPerPage = 6;  // Change this value
```

### Check 2: Test Manual Pagination
```javascript
const component = ng.getComponent(document.querySelector('app-catalogue-luxe'));

// Go to page 2
component.goToPage(2);
console.log('Current page:', component.currentPage);
console.log('Displayed count:', component.displayedProducts.length);
```

**Should show page 2 products**

If not → There's a logic bug in `updatePagination()`

---

## 🔧 SOLUTION 6: Fix Styling Issues (Unstyled Components)

**Problem:** Cards appear but look plain, no colors/spacing

### Check 1: Verify Tailwind Built
```bash
# Rebuild Tailwind
npm run build

# Or restart dev server
npm start
```

### Check 2: Check CSS Not Overridden
Look for global CSS files that might override Tailwind:

```bash
# Check for style conflicts
grep -r "product-card\|app-catalogue" src/app/*.css
```

### Check 3: Verify Tailwind Config
```bash
# Check tailwind.config.js
cat tailwind.config.js | grep -A5 "content"
```

**Should have:**
```javascript
content: ['./src/**/*.{html,ts}'],
```

If different → Fix it:

```javascript
export default {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Then rebuild:
```bash
npm start
```

---

## 🔧 SOLUTION 7: General Cleanup & Restart

**If none of the above work**, try complete reset:

```powershell
cd c:\Users\zakaria\jotya1

# Stop dev server (Ctrl+C)

# Clean cache
rm -r .angular/cache
rm -r node_modules
rm package-lock.json

# Fresh install
npm install

# Rebuild
npm start
```

Wait 1-2 minutes for build to complete.

Then navigate to: `http://localhost:4200/catalogue-luxe`

---

## 📞 STILL HAVING ISSUES?

Check the detailed guide: [CATALOG_ANALYSIS.md](CATALOG_ANALYSIS.md)

### Debug Steps in Order:
1. ✅ Check browser console (F12) for errors
2. ✅ Check Network tab (F12) for 404 images
3. ✅ Run diagnostic script:
   ```powershell
   .\CATALOG_DIAGNOSTIC.ps1
   ```
4. ✅ Check specific component files match analysis
5. ✅ Read Solutions section in CATALOG_ANALYSIS.md

### Key Files to Check:
| File | What to Check |
|------|---------------|
| `src/app/services/product.service.ts` | Image arrays filled |
| `src/app/catalogue-luxe/catalogue-luxe.component.ts` | ngOnInit() runs |
| `src/assets/vetements` | Folder exists with images |
| `angular.json` | Has `"src/assets"` in build.options |
| `src/app/app.routes.ts` | Routes defined for catalogue |

---

**Last Updated:** February 2, 2026  
**Status:** Ready to use  
**Time to fix:** 5-15 minutes typically
