import mongoose from 'mongoose';
import { calculateWarrantyExpiry } from '../utils/warrantyCalculator.js';

export const ALLOWED_CATEGORIES = [
  'Electronics',
  'Appliances',
  'Vehicles',
  'Furniture',
  'Clothing',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Tools & Hardware',
  'Other'
];

const purchaseRecordSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [1, 'Product name cannot be empty'],
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: '{VALUE} is not a supported category'
      },
      default: 'Electronics'
    },
    seller: {
      type: String,
      required: [true, 'Seller is required'],
      trim: true,
      minlength: [1, 'Seller cannot be empty'],
      maxlength: [120, 'Seller cannot exceed 120 characters']
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    warrantyMonths: {
      type: Number,
      required: [true, 'Warranty duration in months is required'],
      min: [0, 'Warranty duration cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Warranty months must be an integer'
      }
    },
    warrantyExpiryDate: {
      type: Date,
      required: [true, 'Warranty expiry date is required'],
      index: true
    },
    receiptUrl: {
      type: String,
      trim: true,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound indexes for high-speed filtered queries and sort operations
purchaseRecordSchema.index({ ownerId: 1, warrantyExpiryDate: 1 });
purchaseRecordSchema.index({ ownerId: 1, purchaseDate: -1 });
purchaseRecordSchema.index({ ownerId: 1, category: 1 });
purchaseRecordSchema.index({ ownerId: 1, productName: 1 });
purchaseRecordSchema.index({ ownerId: 1, seller: 1 });

// Pre-validate hook: automatically calculate and enforce authoritative warrantyExpiryDate
purchaseRecordSchema.pre('validate', function (next) {
  if (this.purchaseDate && this.warrantyMonths !== undefined && this.warrantyMonths !== null) {
    try {
      this.warrantyExpiryDate = calculateWarrantyExpiry(this.purchaseDate, this.warrantyMonths);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const PurchaseRecord = mongoose.model('PurchaseRecord', purchaseRecordSchema);

export default PurchaseRecord;
