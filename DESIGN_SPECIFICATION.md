# JOTYA Luxury Catalogue - Design Specification

## 1. Design Overview & Strategy

### Visual Philosophy
- **Aesthetic**: Minimalist, high-end luxury
- **Target Audience**: Premium/luxury buyers seeking curated products
- **Color Language**: Neutral (beige/white) with strategic yellow & black accents
- **Typography**: Modern, sans-serif with clear hierarchy
- **Spacing**: Generous whitespace for premium feel

### Key Design Decisions
1. **Color Harmony**: Warm neutrals (beige #F5F1E8) paired with gold accents (#C4A000) and black contrast
2. **Typography Hierarchy**: Clear distinction between page titles, section headers, product names, and metadata
3. **Grid System**: Responsive 3-column layout (desktop) → 2-column (tablet) → 1-column (mobile)
4. **Interactive Elements**: Subtle hover states, smooth transitions, no jarring animations
5. **Component-Based**: Structure designed for Angular component decomposition

---

## 2. Color Palette

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Background | Light Beige | #FAF8F4 | Page background |
| Card Background | Off-White | #FFFFFF | Product cards, filter panel |
| Primary Accent | Gold | #C4A000 | Buttons, active states, tags |
| Secondary Accent | Pale Yellow | #FFED00 | "En vente" tags, hover states |
| Text Primary | Dark Gray | #1F1F1F | Body text, product names |
| Text Secondary | Medium Gray | #666666 | Labels, descriptions |
| Text Tertiary | Light Gray | #999999 | Metadata, prices |
| Border | Very Light Gray | #E0DCD5 | Dividers, card borders |
| Footer Background | Almost Black | #1A1A1A | Footer section |

---

## 3. Typography System

### Font Family
- **Primary**: `Sora`, `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Fallback**: System fonts for performance

### Type Scale

| Element | Font Size | Weight | Line Height | Letter Spacing |
|---------|-----------|--------|-------------|-----------------|
| H1 (Page Title) | 48px | 600 | 1.2 | -0.5px |
| H2 (Section) | 32px | 600 | 1.3 | -0.3px |
| H3 (Subsection) | 24px | 600 | 1.4 | 0px |
| H4 (Card Title) | 16px | 600 | 1.5 | 0px |
| Body Large | 16px | 400 | 1.6 | 0px |
| Body | 14px | 400 | 1.5 | 0px |
| Small (Labels) | 12px | 500 | 1.4 | 0.5px |
| Tiny (Metadata) | 11px | 400 | 1.3 | 0.3px |
| Button | 14px | 600 | 1 | 0.5px |

---

## 4. Spacing & Layout System

### Base Unit: 8px Grid
- **xs**: 4px (micro-spacing)
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Responsive Breakpoints
- **Mobile**: 320px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

### Grid Layout
- **Desktop**: 3-column product grid, max-width 1400px
- **Tablet**: 2-column product grid
- **Mobile**: 1-column product grid
- **Gap**: 24px (desktop), 16px (tablet), 12px (mobile)
- **Sidebar Width**: 280px (desktop), hidden on tablet/mobile
- **Container Padding**: 24px (desktop), 16px (tablet/mobile)

---

## 5. Component Specifications

### Header/Navigation
- **Height**: 64px
- **Background**: White with subtle border-bottom
- **Logo Size**: 32px × 32px
- **Menu Items**: 14px, 600 weight, uppercase, 0.5px spacing
- **Icon Size**: 24px
- **Search Bar**: 40px height, placeholder gray, underline on focus

### Filter Sidebar
- **Width**: 280px
- **Background**: #FFFFFF
- **Border**: 1px solid #E0DCD5
- **Padding**: 24px
- **Section Spacing**: 24px
- **Category Items**: 48px height, 14px font
- **Checkbox Size**: 20px × 20px
- **Price Slider**: 100% width, custom thumb styling

### Product Card
- **Aspect Ratio**: 3:4 (image), total card flexible
- **Border**: None (shadow on hover)
- **Shadow**: 0 2px 8px rgba(0,0,0,0.08) (default), 0 12px 24px rgba(0,0,0,0.15) (hover)
- **Transition**: 0.3s ease-out
- **Image**: 100% width, object-fit cover
- **Padding**: 16px (content area)
- **Category Label**: 11px, uppercase, gray
- **Product Name**: 16px, 600 weight, 2-line clamp
- **Price**: 20px, 700 weight, dark
- **State Badge**: 12px font, colored background, rounded
- **Tags**: "En vente" yellow badge, positioned top-right

### Buttons
- **Primary (CTA)**: Black background, white text, 16px height min
- **Secondary**: White background, black border, black text
- **Tertiary**: Transparent, underline on hover
- **Padding**: 12px 24px (standard), 16px 32px (large)
- **Border Radius**: 0px (squared for luxury feel)
- **Transition**: 0.2s ease-out

### Pagination
- **Dot Size**: 36px (circles)
- **Background**: Light gray (inactive), gold (active)
- **Spacing**: 8px between dots
- **Alignment**: Centered

### Footer
- **Background**: #1A1A1A
- **Text Color**: #CCCCCC
- **Accent Color**: #FFED00
- **Padding**: 64px 24px
- **Column Width**: 25% each (4-column grid)
- **Link Color**: Same as text, underline on hover

---

## 6. Interactive States & Transitions

### Hover Effects
- **Product Card**: Subtle lift (+2px), shadow increase, image slight zoom (1.02x)
- **Button**: Color invert, opacity change (0.9)
- **Link**: Underline appears, color change
- **Category**: Background highlight, border-left accent

### Focus States
- **Input**: Blue outline, subtle glow
- **Interactive**: 2px outline with 4px offset

### Transitions
- **Duration**: 0.2s-0.3s
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)

---

## 7. Responsive Behavior

### Desktop (1024px+)
- Full sidebar visible (280px)
- 3-column product grid
- Header: Full menu + search
- Footer: 4-column layout

### Tablet (640px - 1023px)
- Sidebar hidden, filters in modal/drawer
- 2-column product grid
- Header: Hamburger menu, search
- Footer: 2-column layout (stacked)

### Mobile (320px - 639px)
- No sidebar, filters drawer
- 1-column product grid
- Header: Hamburger only
- Footer: Single column, full width

---

## 8. Angular Component Architecture

### Suggested Component Breakdown

```
CatalogueComponent (Main Container)
├── HeaderComponent
│   ├── Logo
│   ├── Navigation Menu
│   └── Search Bar
│   └── UserMenu
│
├── CatalogueLayoutComponent
│   ├── FilterSidebarComponent
│   │   ├── CategoriesFilterComponent
│   │   ├── StateFilterComponent
│   │   └── PriceRangeSliderComponent
│   │
│   └── ProductGridComponent
│       ├── ToolbarComponent (Sort, View)
│       ├── ProductCardComponent (Repeating)
│       │   ├── ProductImage
│       │   ├── ProductInfo
│       │   └── ProductBadge
│       ├── PaginationComponent
│       └── LoadMoreButtonComponent
│
└── FooterComponent
    ├── FooterLinksSection (4x)
    └── NewsletterForm
```

### Component Data Flow
- CatalogueComponent: Manages filters, products, pagination state
- FilterSidebarComponent: Emits filter changes
- ProductGridComponent: Subscribes to filters, displays products
- ProductCardComponent: Presentational (receives product data as @Input)

---

## 9. Accessibility Considerations

- **ARIA Labels**: All icons and interactive elements
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Semantic HTML**: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Alt Text**: All images with descriptive alt attributes
- **Skip Links**: Skip to main content link

---

## 10. Performance Optimizations

- **Image Optimization**: Use `srcset` for responsive images
- **Lazy Loading**: Images load on viewport intersection
- **CSS Variables**: For dynamic theming and reduced duplication
- **BEM Naming**: Predictable, maintainable CSS
- **Mobile-First**: Start with mobile styles, layer desktop enhancements

---

## References

- **Design Inspiration**: Luxury e-commerce (Farfetch, Harrods, Selfridges)
- **Color Theory**: Warm neutrals with gold accents for premium perception
- **Typography**: Geometric sans-serif for modern luxury
- **Spacing**: Golden ratio spacing for visual harmony
