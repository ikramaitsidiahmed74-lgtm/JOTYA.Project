import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Simple in-memory mock products for dev API
app.use(express.json());
type MockProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  verified: boolean;
  imageUrl?: string;
  seller?: string;
  submittedAt?: string;
};

const mockProducts: MockProduct[] = [
  { id: 1, name: 'Mock Jacket', category: 'vetements', price: 120, verified: false, imageUrl: '/assets/vetements/V1.jpg', seller: 'Alice', submittedAt: '2026-02-01' },
  { id: 2, name: 'Mock Phone', category: 'electronique', price: 499, verified: false, imageUrl: '/assets/electro/PC1.PNG', seller: 'Bob', submittedAt: '2026-02-02' },
  { id: 3, name: 'Mock Chair', category: 'maison', price: 299, verified: true, imageUrl: '/assets/maison/MA1.PNG', seller: 'Claire', submittedAt: '2026-01-20' }
];

// GET /api/products - return all products
app.get('/api/products', (req, res) => {
  res.json(mockProducts.slice());
});

// GET /api/products/pending - supports ?page&pageSize&q
app.get('/api/products/pending', (req, res) => {
  const query: any = req.query || {};
  const q = (query['q'] || '').toString().toLowerCase().trim();
  const page = Number(query['page'] || 1);
  const pageSize = Number(query['pageSize'] || 6);
  let list = mockProducts.filter(p => !p.verified);
  if (q) {
    list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.seller || '').toLowerCase().includes(q));
  }
  const total = list.length;
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);
  res.json({ items, total });
});

// POST /api/products/:id/approve
app.post('/api/products/:id/approve', (req, res) => {
  const id = Number(req.params.id);
  const p = mockProducts.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.verified = true;
  return res.json({ ok: true });
});

// POST /api/products/:id/refuse
app.post('/api/products/:id/refuse', (req, res) => {
  const id = Number(req.params.id);
  const idx = mockProducts.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  mockProducts.splice(idx, 1);
  return res.json({ ok: true });
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
