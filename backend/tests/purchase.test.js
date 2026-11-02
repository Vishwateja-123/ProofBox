import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import PurchaseRecord from '../src/models/PurchaseRecord.js';

describe('Purchase CRUD & Search Integration Tests', () => {
  let userToken = '';
  let userId = '';
  let createdPurchaseId = '';

  const testUser = {
    name: 'Ananya Sharma',
    email: `test_purchase_${Date.now()}@example.com`,
    password: 'SecurePassword2026!'
  };

  before(async () => {
    await connectDB();
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    userToken = regRes.body.token;
    userId = regRes.body.user.id;
  });

  after(async () => {
    if (userId) {
      await PurchaseRecord.deleteMany({ ownerId: userId });
      await User.findByIdAndDelete(userId);
    }
    await disconnectDB();
  });

  it('GET /api/health — Returns server and database health status', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.status, 'healthy');
    assert.equal(res.body.database.status, 'connected');
  });

  it('POST /api/purchases — Creates a valid purchase record with calculated expiry', async () => {
    const purchaseData = {
      productName: 'Sony WH-1000XM5 Headphones',
      category: 'Electronics',
      seller: 'Amazon India',
      purchaseDate: '2025-01-15T00:00:00.000Z',
      price: 26990,
      warrantyMonths: 12,
      receiptUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      notes: 'Includes manufacturer warranty card.'
    };

    const res = await request(app)
      .post('/api/purchases')
      .set('Authorization', `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(201);

    assert.equal(res.body.success, true);
    assert.equal(res.body.purchase.productName, purchaseData.productName);
    assert.equal(res.body.purchase.price, 26990);
    assert(res.body.purchase.warrantyExpiryDate, 'Authoritative expiry date must be computed');
    assert(res.body.purchase.warrantyStatus, 'Warranty status must be assigned');
    assert.equal(res.body.purchase.ownerId.toString(), userId);

    createdPurchaseId = res.body.purchase._id;
  });

  it('POST /api/purchases — Rejects negative price and invalid date', async () => {
    const res = await request(app)
      .post('/api/purchases')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        productName: 'Faulty Item',
        category: 'Electronics',
        seller: 'Store',
        purchaseDate: 'invalid-date',
        price: -500,
        warrantyMonths: 6
      })
      .expect(400);

    assert.equal(res.body.success, false);
    assert(res.body.errors.length >= 2);
  });

  it('GET /api/purchases — Lists purchases with pagination and metadata', async () => {
    const res = await request(app)
      .get('/api/purchases')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert(res.body.total >= 1);
    assert.equal(res.body.purchases[0]._id, createdPurchaseId);
  });

  it('GET /api/purchases/:id — Retrieves single purchase record by valid ID', async () => {
    const res = await request(app)
      .get(`/api/purchases/${createdPurchaseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.purchase._id, createdPurchaseId);
    assert.equal(res.body.purchase.productName, 'Sony WH-1000XM5 Headphones');
  });

  it('GET /api/purchases/:id — Rejects malformed ID with 400 Bad Request', async () => {
    const res = await request(app)
      .get('/api/purchases/invalid-mongo-id-123')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /invalid id format/i);
  });

  it('PATCH /api/purchases/:id — Updates purchase and recalculates warranty expiry', async () => {
    const res = await request(app)
      .patch(`/api/purchases/${createdPurchaseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        warrantyMonths: 24,
        price: 24999
      })
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.purchase.price, 24999);
    assert.equal(res.body.purchase.warrantyMonths, 24);
    // Expiry date must have moved forward by 12 additional months
    const updatedExpiry = new Date(res.body.purchase.warrantyExpiryDate);
    assert.equal(updatedExpiry.getUTCFullYear(), 2027);
  });

  it('GET /api/purchases — Searches by product name and seller', async () => {
    const res = await request(app)
      .get('/api/purchases?search=Sony')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert(res.body.purchases.length >= 1);

    const nonMatchRes = await request(app)
      .get('/api/purchases?search=NonExistentProductXYZ')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.equal(nonMatchRes.body.purchases.length, 0);
  });

  it('GET /api/purchases/expiring — Correctly routes and returns expiring warranties', async () => {
    const res = await request(app)
      .get('/api/purchases/expiring')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert(Array.isArray(res.body.purchases));
  });

  it('GET /api/dashboard/summary — Generates accurate dashboard aggregates', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert(res.body.summary.totalPurchases >= 1);
    assert.equal(typeof res.body.summary.totalSpend, 'number');
    assert(Array.isArray(res.body.summary.categoryBreakdown));
    assert(Array.isArray(res.body.summary.recentPurchases));
  });

  it('DELETE /api/purchases/:id — Deletes the purchase record', async () => {
    const res = await request(app)
      .delete(`/api/purchases/${createdPurchaseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.id, createdPurchaseId);

    // Verify subsequent lookup yields 404
    await request(app)
      .get(`/api/purchases/${createdPurchaseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});
