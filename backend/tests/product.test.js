import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('Product Catalog & Search API Tests', () => {
  it('GET /api/products/popular — returns trending flagship products', async () => {
    const res = await request(app).get('/api/products/popular');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.products));
    assert.ok(res.body.products.length > 0);

    const first = res.body.products[0];
    assert.ok(first.name);
    assert.ok(first.brand);
    assert.ok(Array.isArray(first.colors));
    assert.ok(first.colors[0].hex);
    assert.ok(first.colors[0].image);
  });

  it('GET /api/products/search?q=iphone — returns iPhone variants with colors and specs', async () => {
    const res = await request(app).get('/api/products/search?q=iphone');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.products.length > 0);

    const match = res.body.products.find((p) => p.name.includes('iPhone 16 Pro'));
    assert.ok(match, 'Should find iPhone 16 Pro');
    assert.equal(match.brand, 'Apple');
    assert.equal(match.category, 'Electronics');
    assert.equal(match.defaultWarrantyMonths, 12);

    const desert = match.colors.find((c) => c.name.includes('Desert'));
    assert.ok(desert, 'Should include Desert Titanium finish');
    assert.ok(desert.image.startsWith('https://'));
  });

  it('GET /api/products/search?q=macbook — returns MacBook models and finishes', async () => {
    const res = await request(app).get('/api/products/search?q=macbook');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    const macbook = res.body.products.find((p) => p.name.includes('MacBook'));
    assert.ok(macbook, 'Should find MacBook model');
    assert.ok(macbook.variants.length > 0);
  });

  it('GET /api/products/search?q= — returns default products without crashing', async () => {
    const res = await request(app).get('/api/products/search?q=');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.products.length > 0);
  });
});
