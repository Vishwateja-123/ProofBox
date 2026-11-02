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

  it('POST /api/auth/google — Seamlessly links Google login if account was originally created with password', async () => {
    const passwordEmail = `test_google_linking_${Date.now()}@gmail.com`;

    // Create a local password user first
    const passwordHash = await User.hashPassword('LinkingPass123!');
    const localUser = await User.create({
      name: 'Linking User',
      email: passwordEmail,
      passwordHash,
      authProvider: 'local'
    });

    const mockGoogleSub = `sub_link_${Date.now()}`;
    const mockPicture = 'https://lh3.googleusercontent.com/a/linked-avatar';

    // Authenticate with Google using that same verified email
    setGoogleVerifier(async () => ({
      sub: mockGoogleSub,
      email: passwordEmail,
      email_verified: true,
      name: 'Linking User Google',
      picture: mockPicture
    }));

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'mock-linking-token' })
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.user.email, passwordEmail);
    assert.equal(res.body.user.avatar, mockPicture);
    assert(res.body.token, 'Must return session token');

    // Verify database document was updated with googleId without duplicating
    const updatedUser = await User.findById(localUser._id);
    assert.equal(updatedUser.googleId, mockGoogleSub);
    assert.equal(updatedUser.avatar, mockPicture);

    const count = await User.countDocuments({ email: passwordEmail });
    assert.equal(count, 1, 'Must link to the same account and not create duplicate');

    // Clean up
    await User.deleteOne({ _id: localUser._id });
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

