import { describe, it, expect } from 'vitest';
import { productCatalogService } from '../services/productCatalogService.js';
import { CURATED_PRODUCTS } from '../data/productCatalog.js';

describe('Product Catalog Service Tests', () => {
  it('returns curated flagships on empty search query', async () => {
    const products = await productCatalogService.search('');
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('accurately searches iPhone models with colors and variants', async () => {
    const products = await productCatalogService.search('iphone');
    expect(products.length).toBeGreaterThan(0);

    const iphone16 = products.find((p) => p.name.includes('iPhone 16 Pro'));
    expect(iphone16).toBeDefined();
    expect(iphone16.brand).toBe('Apple');
    expect(iphone16.colors.length).toBeGreaterThanOrEqual(4);
    expect(iphone16.colors[0].hex).toBeDefined();
    expect(iphone16.colors[0].image).toContain('https://');
    expect(iphone16.variants.length).toBeGreaterThanOrEqual(3);
  });

  it('finds MacBook models and finishes', async () => {
    const products = await productCatalogService.search('macbook air');
    expect(products.length).toBeGreaterThan(0);

    const mac = products[0];
    expect(mac.name).toContain('MacBook');
    expect(mac.colors.some((c) => c.name.toLowerCase().includes('midnight'))).toBe(true);
  });

  it('returns popular flagships for quick pick exploration', async () => {
    const popular = await productCatalogService.getPopular();
    expect(popular.length).toBeGreaterThan(0);
    expect(popular.some((p) => p.brand === 'Apple')).toBe(true);
  });
});
