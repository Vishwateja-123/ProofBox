import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'proofbox_super_secret_jwt_key_2026_sr_university_auth_token';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name
    },
    secret,
    { expiresIn }
  );
}


export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });
}

export function clearAuthCookie(res) {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
}

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No authorization token was provided.'
      });
    }

    const secret = process.env.JWT_SECRET || 'proofbox_super_secret_jwt_key_2026_sr_university_auth_token';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('_id name email createdAt');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user account associated with this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }
}
