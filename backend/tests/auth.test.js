import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';

describe('Authentication API Integration Tests', () => {
  const testUser = {
    name: 'Suresh Kumar',
    email: `test_auth_${Date.now()}@example.com`,
    password: 'Password123!'
  };

  let authToken = '';

  before(async () => {
    await connectDB();
    // Clean up any previous test accounts with this prefix
    await User.deleteMany({ email: { $regex: /^test_auth_/ } });
  });

  after(async () => {
    await User.deleteMany({ email: { $regex: /^test_auth_/ } });
    await disconnectDB();
  });

  it('POST /api/auth/register — Successfully registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    assert.equal(res.body.success, true);
    assert.equal(res.body.user.name, testUser.name);
    assert.equal(res.body.user.email, testUser.email.toLowerCase());
    assert(res.body.token, 'Token must be returned');
    assert.equal(res.body.user.passwordHash, undefined, 'Password hash must never be returned');

    authToken = res.body.token;
  });

  it('POST /api/auth/register — Rejects duplicate registration with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(409);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /already exists/i);
  });

  it('POST /api/auth/register — Rejects invalid email and short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'invalid-email',
        password: '123'
      })
      .expect(400);

    assert.equal(res.body.success, false);
    assert(res.body.errors.length >= 2);
  });

  it('POST /api/auth/login — Successfully logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, testUser.email.toLowerCase());
    assert(res.body.token);
  });

  it('POST /api/auth/login — Rejects incorrect password with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword999'
      })
      .expect(401);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /invalid email or password/i);
  });

  it('GET /api/auth/profile — Accesses protected profile with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, testUser.email.toLowerCase());
  });

  it('GET /api/auth/profile — Rejects unauthenticated request with 401 Unauthorized', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .expect(401);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Authentication required/i);
  });

  it('POST /api/auth/logout — Successfully logs out and clears session', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(res.body.success, true);
    assert.match(res.body.message, /Logged out successfully/i);
  });
});
