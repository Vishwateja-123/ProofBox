import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import { setGoogleVerifier, resetGoogleVerifier } from '../src/utils/googleAuth.js';

describe('Google OAuth 2.0 Authentication Tests', () => {
  const originalClientId = process.env.GOOGLE_CLIENT_ID;
  const mockClientId = 'mock-google-client-id-12345.apps.googleusercontent.com';

  const testGoogleEmail = `test_google_${Date.now()}@gmail.com`;
  const testGoogleSub = `sub_google_${Date.now()}`;
  const testGoogleUser = {
    sub: testGoogleSub,
    email: testGoogleEmail,
    email_verified: true,
    name: 'Google Test User',
    picture: 'https://lh3.googleusercontent.com/a/mock-avatar'
  };

  before(async () => {
    process.env.GOOGLE_CLIENT_ID = mockClientId;
    await connectDB();
    await User.deleteMany({ email: { $regex: /^test_google_/ } });
  });

  after(async () => {
    process.env.GOOGLE_CLIENT_ID = originalClientId;
    resetGoogleVerifier();
    await User.deleteMany({ email: { $regex: /^test_google_/ } });
    await disconnectDB();
  });

  beforeEach(() => {
    resetGoogleVerifier();
    process.env.GOOGLE_CLIENT_ID = mockClientId;
  });

  it('POST /api/auth/google — Rejects request without ID token (400 Bad Request)', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({})
      .expect(400);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /token.*required/i);
  });

  it('POST /api/auth/google — Returns 500 if GOOGLE_CLIENT_ID is not configured on server', async () => {
    delete process.env.GOOGLE_CLIENT_ID;

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'some-token' })
      .expect(500);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /not configured/i);
  });

  it('POST /api/auth/google — Rejects invalid or expired Google ID token (401 Unauthorized)', async () => {
    setGoogleVerifier(async () => {
      const err = new Error('Invalid token signature');
      throw err;
    });

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'invalid.jwt.token' })
      .expect(401);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /invalid or expired/i);
  });

  it('POST /api/auth/google — Rejects unverified Google email address (401 Unauthorized)', async () => {
    setGoogleVerifier(async () => ({
      sub: 'unverified-sub',
      email: 'unverified@gmail.com',
      email_verified: false,
      name: 'Unverified'
    }));

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'valid.token.unverified' })
      .expect(401);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /not been verified/i);
  });

  it('POST /api/auth/google — Successfully registers a brand-new Google user and returns JWT & user profile', async () => {
    setGoogleVerifier(async () => testGoogleUser);

    const res = await request(app)
      .post('/api/auth/google')
      .send({ credential: 'mock-valid-google-credential' })
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, testGoogleEmail);
    assert.equal(res.body.user.name, testGoogleUser.name);
    assert.equal(res.body.user.avatar, testGoogleUser.picture);
    assert.equal(res.body.user.authProvider, 'google');
    assert(res.body.token, 'Must return a valid ProofBox JWT session token');

    // Verify user exists in MongoDB with googleId and authProvider
    const savedUser = await User.findOne({ googleId: testGoogleSub });
    assert(savedUser, 'User document must be saved in database');
    assert.equal(savedUser.authProvider, 'google');
    assert.equal(savedUser.avatar, testGoogleUser.picture);
  });

  it('POST /api/auth/google — Allows existing Google user to sign in without duplicate registration', async () => {
    // Modify picture to test avatar update on existing user
    const updatedPicture = 'https://lh3.googleusercontent.com/a/updated-avatar';
    setGoogleVerifier(async () => ({
      ...testGoogleUser,
      picture: updatedPicture
    }));

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'mock-existing-user-token' })
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, testGoogleEmail);
    assert.equal(res.body.user.avatar, updatedPicture);

    // Verify only ONE document exists in MongoDB for this email
    const count = await User.countDocuments({ email: testGoogleEmail });
    assert.equal(count, 1, 'Must not duplicate account in MongoDB');
  });

  it('POST /api/auth/google — Rejects Google sign-in if account exists with password auth (409 Conflict)', async () => {
    const passwordEmail = `test_google_conflict_${Date.now()}@gmail.com`;

    // Create a local password user first
    const passwordHash = await User.hashPassword('ConflictPass123!');
    await User.create({
      name: 'Conflict User',
      email: passwordEmail,
      passwordHash,
      authProvider: 'local'
    });

    // Attempt to authenticate with Google using that same email
    setGoogleVerifier(async () => ({
      sub: `sub_conflict_${Date.now()}`,
      email: passwordEmail,
      email_verified: true,
      name: 'Conflict User Google'
    }));

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'mock-conflict-token' })
      .expect(409);

    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'ACCOUNT_EXISTS_WITH_PASSWORD');
    assert.match(res.body.message, /exists using password/i);

    // Clean up
    await User.deleteOne({ email: passwordEmail });
  });

  it('POST /api/auth/login — Rejects password login attempt on a Google-only account without password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testGoogleEmail,
        password: 'AttemptPassword123!'
      })
      .expect(401);

    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'USE_GOOGLE_SIGN_IN');
    assert.match(res.body.message, /created with google/i);
  });
});

