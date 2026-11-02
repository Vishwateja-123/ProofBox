import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import PurchaseRecord from '../models/PurchaseRecord.js';
import { calculateWarrantyExpiry } from '../utils/warrantyCalculator.js';

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proofbox';
  console.log(`[Seed] Connecting to MongoDB: ${uri}`);
  await mongoose.connect(uri);

  const demoEmail = 'demo@proofbox.com';
  const demoPassword = 'DemoPassword123!';

  // Clean existing demo user and records
  const existingUser = await User.findOne({ email: demoEmail });
  if (existingUser) {
    console.log(`[Seed] Cleaning previous demo data for ${demoEmail}...`);
    await PurchaseRecord.deleteMany({ ownerId: existingUser._id });
    await User.findByIdAndDelete(existingUser._id);
  }

  // Create demo user
  const passwordHash = await User.hashPassword(demoPassword);
  const demoUser = await User.create({
    name: 'Vishwateja Paidipelly',
    email: demoEmail,
    passwordHash
  });
  console.log(`[Seed] Created Demo User: ${demoUser.email} (Password: ${demoPassword})`);

  const now = new Date();

  // Helper to construct dates relative to today
  const daysAgo = (days) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days));
  const monthsAgo = (months) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, now.getUTCDate()));

  const samplePurchases = [
    {
      productName: 'Apple MacBook Air M3 (16GB, 512GB)',
      category: 'Electronics',
      seller: 'Apple Store Online',
      purchaseDate: monthsAgo(3),
      price: 134900,
      warrantyMonths: 12, // Active: ~9 months remaining
      receiptUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      notes: 'Serial: C02GM3PROOFBOX. AppleCare eligible within first year.'
    },
    {
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      category: 'Electronics',
      seller: 'Amazon India',
      // Purchased ~347 days ago with 12m warranty (365 days) -> exactly ~18 days remaining!
      purchaseDate: daysAgo(347),
      price: 26990,
      warrantyMonths: 12,
      receiptUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      notes: 'Invoice No: INV-2025-88912. Left earcup active noise cancellation verified.'
    },
    {
      productName: 'Samsung 55" Crystal 4K UHD Smart TV',
      category: 'Appliances',
      seller: 'Croma Retail',
      // Purchased ~718 days ago with 24m warranty (730 days) -> ~12 days remaining!
      purchaseDate: daysAgo(718),
      price: 45990,
      warrantyMonths: 24,
      receiptUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
      notes: 'Includes panel warranty. Customer service hotline: 1800-40-7267864.'
    },
    {
      productName: 'Dyson V12 Detect Slim Vacuum',
      category: 'Home & Kitchen',
      seller: 'Dyson Official Store',
      purchaseDate: monthsAgo(28),
      price: 52900,
      warrantyMonths: 24, // Expired ~4 months ago!
      receiptUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001',
      notes: 'Warranty period ended. Fluffy cleaner head replaced under warranty in Month 18.'
    },
    {
      productName: 'Herman Miller Aeron Ergonomic Chair',
      category: 'Furniture',
      seller: 'Office Solutions Ltd',
      purchaseDate: monthsAgo(6),
      price: 115000,
      warrantyMonths: 144, // 12-Year Herman Miller warranty!
      receiptUrl: 'https://images.unsplash.com/photo-1580481077195-c3a821a506cb',
      notes: '12-Year comprehensive manufacturer warranty covering frame, tilt, and PostureFit SL.'
    },
    {
      productName: 'Bosch 8kg Front Load Washing Machine',
      category: 'Appliances',
      seller: 'Reliance Digital',
      // Purchased ~360 days ago with 12m warranty -> ~5 days remaining!
      purchaseDate: daysAgo(360),
      price: 38500,
      warrantyMonths: 12,
      receiptUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1',
      notes: 'Motor covered under separate 10-year warranty. Comprehensive warranty expiring soon.'
    },
    {
      productName: 'Garmin Forerunner 265 GPS Running Watch',
      category: 'Sports & Outdoors',
      seller: 'Garmin Official',
      purchaseDate: monthsAgo(4),
      price: 42990,
      warrantyMonths: 24, // Active
      receiptUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      notes: 'Optical heart rate and barometric altimeter covered.'
    }
  ];

  console.log(`[Seed] Inserting ${samplePurchases.length} sample purchases with calculated warranties...`);

  for (const item of samplePurchases) {
    const expiry = calculateWarrantyExpiry(item.purchaseDate, item.warrantyMonths);
    await PurchaseRecord.create({
      ownerId: demoUser._id,
      productName: item.productName,
      category: item.category,
      seller: item.seller,
      purchaseDate: item.purchaseDate,
      price: item.price,
      warrantyMonths: item.warrantyMonths,
      warrantyExpiryDate: expiry,
      receiptUrl: item.receiptUrl,
      notes: item.notes
    });
  }

  console.log('----------------------------------------------------');
  console.log('✅ ProofBox Database Seeding Completed Successfully!');
  console.log(`👤 Demo Account: ${demoEmail}`);
  console.log(`🔑 Demo Password: ${demoPassword}`);
  console.log(`📦 Seeded Purchases: ${samplePurchases.length}`);
  console.log('----------------------------------------------------');

  await mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
