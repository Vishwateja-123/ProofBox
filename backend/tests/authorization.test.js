import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import PurchaseRecord from '../src/models/PurchaseRecord.js';

describe('Cross-User Authorization & Data Isolation Tests', () => {
  let userAToken = '';
  let userBToken = '';
  let userAId = '';
  let userBId = '';
  let userAPurchaseId = '';

  const timestamp = Date.now();
  const userAData = {
    name: 'User Alpha',
    email: `alpha_${timestamp}@example.com`,
    password: 'PasswordAlpha123!'
  };

  const userBData = {
    name: 'User Beta',
    email: `beta_${timestamp}@example.com`,
    password: 'PasswordBeta123!'
  };

  before(async () => {
    await connectDB();

    // Register User A
    const resA = await request(app).post('/api/auth/register').send(userAData);
    userAToken = resA.body.token;
    userAId = resA.body.user.id;

    // Register User B
    const resB = await request(app).post('/api/auth/register').send(userBData);
    userBToken = resB.body.token;
    userBId = resB.body.user.id;

    // Create a private purchase under User A
    const purchaseRes = await request(app)
      .post('/api/purchases')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        productName: 'Confidential Laptop for Alpha',
        category: 'Electronics',
        seller: 'Apple Store',
        purchaseDate: '2025-05-01T00:00:00.000Z',
        price: 150000,
        warrantyMonths: 24
      });

    userAPurchaseId = purchaseRes.body.purchase._id;
  });

  after(async () => {
    if (userAId) {
      await PurchaseRecord.deleteMany({ ownerId: userAId });
      await User.findByIdAndDelete(userAId);
    }
    if (userBId) {
      await PurchaseRecord.deleteMany({ ownerId: userBId });
      await User.findByIdAndDelete(userBId);
    }
    await disconnectDB();
  });

  it("User B CANNOT view User A's private purchase by ID (404 Not Found)", async () => {
    const res = await request(app)
      .get(`/api/purchases/${userAPurchaseId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(404);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /not found or you do not have permission/i);
  });

  it("User B CANNOT modify User A's purchase (404 Not Found)", async () => {
    const res = await request(app)
      .patch(`/api/purchases/${userAPurchaseId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ productName: 'Tampered Laptop Name' })
      .expect(404);

    assert.equal(res.body.success, false);

    // Verify User A's data was not modified
    const checkRes = await request(app)
      .get(`/api/purchases/${userAPurchaseId}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(200);

    assert.equal(checkRes.body.purchase.productName, 'Confidential Laptop for Alpha');
  });

  it("User B CANNOT delete User A's purchase (404 Not Found)", async () => {
    const res = await request(app)
      .delete(`/api/purchases/${userAPurchaseId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(404);

    assert.equal(res.body.success, false);

    // Verify record still exists for User A
    const checkRes = await request(app)
      .get(`/api/purchases/${userAPurchaseId}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(200);

    assert.equal(checkRes.body.purchase._id, userAPurchaseId);
  });

  it("User B's purchase list does not include User A's items", async () => {
    const res = await request(app)
      .get('/api/purchases')
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.total, 0);
    assert.equal(res.body.purchases.length, 0);
  });

  it("User B cannot search and discover User A's products", async () => {
    const res = await request(app)
      .get('/api/purchases?search=Confidential')
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.purchases.length, 0);
  });
});
