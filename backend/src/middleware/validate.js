import mongoose from 'mongoose';
import { ALLOWED_CATEGORIES } from '../models/PurchaseRecord.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return true; // optional
  const trimmed = url.trim();
  if (trimmed === '') return true;
  try {
    const parsed = new URL(trimmed);
    return ['http:', 'https:', 'data:'].includes(parsed.protocol);
  } catch {
    // Also allow relative paths for local uploaded receipts
    return trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/');
  }
}

export function validatePurchaseCreate(req, res, next) {
  const { productName, category, seller, purchaseDate, price, warrantyMonths, receiptUrl, notes } = req.body;
  const errors = [];

  if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
    errors.push('Product name is required');
  } else if (productName.trim().length > 120) {
    errors.push('Product name cannot exceed 120 characters');
  }

  if (!category || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (!seller || typeof seller !== 'string' || seller.trim().length === 0) {
    errors.push('Seller name is required');
  } else if (seller.trim().length > 120) {
    errors.push('Seller cannot exceed 120 characters');
  }

  if (!purchaseDate) {
    errors.push('Purchase date is required');
  } else {
    const d = new Date(purchaseDate);
    if (isNaN(d.getTime())) {
      errors.push('Purchase date must be a valid date');
    }
  }

  if (price === undefined || price === null || price === '') {
    errors.push('Price is required');
  } else {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (warrantyMonths === undefined || warrantyMonths === null || warrantyMonths === '') {
    errors.push('Warranty duration in months is required');
  } else {
    const months = Number(warrantyMonths);
    if (isNaN(months) || !Number.isInteger(months) || months < 0) {
      errors.push('Warranty duration must be an integer greater than or equal to 0');
    }
  }

  if (receiptUrl && !isValidUrl(receiptUrl)) {
    errors.push('Receipt URL must be a valid web link (http/https)');
  }

  if (notes && typeof notes === 'string' && notes.length > 1000) {
    errors.push('Notes cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validatePurchaseUpdate(req, res, next) {
  const { productName, category, seller, purchaseDate, price, warrantyMonths, receiptUrl, notes } = req.body;
  const errors = [];

  if (productName !== undefined) {
    if (typeof productName !== 'string' || productName.trim().length === 0) {
      errors.push('Product name cannot be empty');
    } else if (productName.trim().length > 120) {
      errors.push('Product name cannot exceed 120 characters');
    }
  }

  if (category !== undefined && !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (seller !== undefined) {
    if (typeof seller !== 'string' || seller.trim().length === 0) {
      errors.push('Seller name cannot be empty');
    } else if (seller.trim().length > 120) {
      errors.push('Seller cannot exceed 120 characters');
    }
  }

  if (purchaseDate !== undefined) {
    const d = new Date(purchaseDate);
    if (isNaN(d.getTime())) {
      errors.push('Purchase date must be a valid date');
    }
  }

  if (price !== undefined) {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (warrantyMonths !== undefined) {
    const months = Number(warrantyMonths);
    if (isNaN(months) || !Number.isInteger(months) || months < 0) {
      errors.push('Warranty duration must be an integer greater than or equal to 0');
    }
  }

  if (receiptUrl !== undefined && receiptUrl && !isValidUrl(receiptUrl)) {
    errors.push('Receipt URL must be a valid web link (http/https)');
  }

  if (notes !== undefined && typeof notes === 'string' && notes.length > 1000) {
    errors.push('Notes cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: "${id}". Must be a 24-character hexadecimal MongoDB ObjectId.`
    });
  }
  next();
}
