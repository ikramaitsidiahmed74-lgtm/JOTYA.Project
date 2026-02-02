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
  default: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
  <rect x="4" y="4" width="16" height="16" rx="3" />
  <path d="M9 9h6v6H9Z" />
</svg>
`
};

export const CATEGORY_ICON_DEFAULT = CATEGORY_ICON_SVGS['default'];
