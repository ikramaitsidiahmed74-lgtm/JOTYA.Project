export const CATEGORY_ICON_SVGS: Record<string, string> = {
  vetements: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <path d="M9 4.5 7 6 4.8 5 3.5 8l2.8 1.4V20h12V9.4L21.1 8 19.8 5l-2.2 1L15 4.5Z" />
  <path d="M9 4.5h6" />
</svg>
`,
  accessoires: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <rect x="4.5" y="8" width="15" height="11" rx="2" />
  <path d="M9 8a3 3 0 0 1 6 0" />
  <path d="M9 12.5h6" />
</svg>
`,
  electronique: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <rect x="7" y="3.5" width="10" height="17" rx="2" />
  <path d="M9 6.5h6" />
  <circle cx="12" cy="17.5" r="0.8" />
</svg>
`,
  chaussures: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <path d="M3.5 13.5h3.2L9.2 11l3 2.5h5.3a2 2 0 0 1 2 2v1.8H4.5a2 2 0 0 1-2-2Z" />
  <path d="M9.2 11v2.2" />
  <path d="M14 13.5v1.5" />
  <path d="M6 13.5v2.3" />
</svg>
`,
  lunettes: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <circle cx="7.5" cy="12" r="3" />
  <circle cx="16.5" cy="12" r="3" />
  <path d="M10.5 12h3" />
  <path d="M4.5 12H3" />
  <path d="M21 12h-1.5" />
  <path d="M7 9l0.8-2h8.4L17 9" />
</svg>
`,
  maison: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <path d="M3 10.5L12 4l9 6.5" />
  <path d="M5 9.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
  <rect x="9" y="14" width="6" height="6" />
</svg>
`,
  'pieces-uniques': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <polygon points="12,2 15,8.5 22,9.3 17,14 18.2,21 12,17.5 5.8,21 7,14 2,9.3 9,8.5" />
</svg>
`,
  marques: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14l-4.8 2.6.9-5.3-3.8-3.7 5.3-.8L12 2z" />
  <circle cx="12" cy="12" r="2.5" />
</svg>
`,
  velo: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <circle cx="5.5" cy="16" r="3" />
  <circle cx="18.5" cy="16" r="3" />
  <path d="M5.5 16l4-7h5l2 4" />
  <path d="M14.5 13l4 3" />
  <path d="M9.5 9l-1-3h3" />
</svg>
`,
  construction: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <path d="M10 4L8 8h8l-2-4h-4z" />
  <path d="M6 8h12v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z" />
  <path d="M10 13v7" />
  <path d="M14 13v7" />
  <path d="M8 20h8" />
</svg>
`,
  default: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <rect x="4" y="4" width="16" height="16" rx="3" />
  <path d="M9 9h6v6H9Z" />
</svg>
`
};

export const CATEGORY_ICON_DEFAULT = CATEGORY_ICON_SVGS['default'];
