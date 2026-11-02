import { request } from './api.js';
import { CURATED_PRODUCTS } from '../data/productCatalog.js';

function localMatchScore(product, query) {
  const q = query.toLowerCase().trim();
  const name = product.name.toLowerCase();
  const brand = product.brand.toLowerCase();
  const tagline = (product.tagline || '').toLowerCase();
  const models = (product.models || []).map((m) => m.toLowerCase()).join(' ');

  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (brand === q) return 50;
  if (brand.startsWith(q)) return 45;
  if (models.includes(q)) return 40;
  if (tagline.includes(q)) return 20;

  const queryTokens = q.split(/\s+/).filter(Boolean);
  const matchedTokens = queryTokens.filter(
    (token) => name.includes(token) || brand.includes(token) || models.includes(token)
  );
  if (matchedTokens.length === queryTokens.length) {
    return 35 + matchedTokens.length * 5;
  }
  if (matchedTokens.length > 0) {
    return matchedTokens.length * 10;
  }

  return 0;
}

function searchCuratedLocal(query) {
  if (!query || !query.trim()) {
    return CURATED_PRODUCTS.slice(0, 6);
  }
  const q = query.trim().toLowerCase();
  return CURATED_PRODUCTS.map((prod) => ({
    product: prod,
    score: localMatchScore(prod, q)
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}

export const productCatalogService = {
  /**
   * Search products by query term.
   * Hits the backend API first, falling back smoothly to local curated products.
   */
  async search(query) {
    const trimmed = (query || '').trim();
    try {
      const res = await request(`/products/search?q=${encodeURIComponent(trimmed)}`, {
        method: 'GET'
      });
      if (res && res.success && Array.isArray(res.products) && res.products.length > 0) {
        return res.products;
      }
      return searchCuratedLocal(trimmed);
    } catch {
      // Local zero-latency fallback
      return searchCuratedLocal(trimmed);
    }
  },

  /**
   * Returns popular trending flagship products
   */
  async getPopular() {
    try {
      const res = await request('/products/popular', { method: 'GET' });
      if (res && res.success && Array.isArray(res.products)) {
        return res.products;
      }
      return CURATED_PRODUCTS.slice(0, 8);
    } catch {
      return CURATED_PRODUCTS.slice(0, 8);
    }
  }
};
