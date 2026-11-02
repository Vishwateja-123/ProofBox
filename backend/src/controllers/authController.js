import User from '../models/User.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../middleware/auth.js';
import { verifyGoogleToken } from '../utils/googleAuth.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email address already exists.'
      });
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Create user record
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });

    // Generate JWT and set auth cookie
    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        authProvider: user.authProvider || 'local',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if account is a Google-only account without password
    if (user.authProvider === 'google' && !user.passwordHash) {
      return res.status(401).json({
        success: false,
        code: 'USE_GOOGLE_SIGN_IN',
        message: 'This account was created with Google Sign-In. Please click Continue with Google.'
      });
    }

    // Verify password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT and set auth cookie
    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        authProvider: user.authProvider || 'local',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log out user (clear session cookie)
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

/**
 * Get current user profile
 * GET /api/auth/profile
 */
export async function getProfile(req, res) {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar || null,
      authProvider: req.user.authProvider || 'local',
      createdAt: req.user.createdAt
    }
  });
}

/**
 * Google OAuth 2.0 Sign-In / Registration
 * POST /api/auth/google
 */
export async function googleAuth(req, res, next) {
  try {
    const idToken = req.body.idToken || req.body.credential;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token credential is required.'
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({
        success: false,
        message: 'Google Sign-In is not configured on the server. Please set GOOGLE_CLIENT_ID in backend/.env'
      });
    }

    let payload;
    try {
      payload = await verifyGoogleToken(idToken, clientId);
    } catch (verifyErr) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Google authentication token.'
      });
    }

    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Unable to extract verified user profile from Google token.'
      });
    }

    if (!payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Your Google email address has not been verified.'
      });
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const googleSub = String(payload.sub);

    // 1. Try to find user by existing googleId
    let user = await User.findOne({ googleId: googleSub });

    if (user) {
      // Existing Google user found - update profile details if changed
      if (payload.picture && user.avatar !== payload.picture) {
        user.avatar = payload.picture;
        await user.save();
      }
    } else {
      // 2. Check if user already exists with this email address
      const existingByEmail = await User.findOne({ email: normalizedEmail });

      if (existingByEmail) {
        // Seamlessly link Google identity to existing account (Industry Standard automatic linking)
        existingByEmail.googleId = googleSub;
        if (payload.picture && !existingByEmail.avatar) {
          existingByEmail.avatar = payload.picture;
        }
        user = await existingByEmail.save();
      } else {
        // 3. Register brand-new user via Google
        user = await User.create({
          name: (payload.name && payload.name.trim()) || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          googleId: googleSub,
          avatar: payload.picture || null,
          authProvider: 'google'
        });
      }
    }

    // Generate standard ProofBox JWT token and cookie
    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        authProvider: user.authProvider || 'google',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}
