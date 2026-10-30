import PurchaseRecord from '../models/PurchaseRecord.js';
import {
  calculateWarrantyExpiry,
  augmentPurchaseWithWarranty
} from '../utils/warrantyCalculator.js';

export async function createPurchase(req, res, next) {
  try {
    const {
      productName,
      category,
      seller,
      purchaseDate,
      price,
      warrantyMonths,
      receiptUrl,
      notes
    } = req.body;

    const calculatedExpiry = calculateWarrantyExpiry(purchaseDate, warrantyMonths);

    const purchase = new PurchaseRecord({
      ownerId: req.user._id,
      productName: productName.trim(),
      category,
      seller: seller.trim(),
      purchaseDate: new Date(purchaseDate),
      price: Number(price),
      warrantyMonths: Number(warrantyMonths),
      warrantyExpiryDate: calculatedExpiry,
      receiptUrl: receiptUrl ? receiptUrl.trim() : '',
      notes: notes ? notes.trim() : ''
    });

    const saved = await purchase.save();

    res.status(201).json({
      success: true,
      message: 'Purchase record saved successfully.',
      purchase: augmentPurchaseWithWarranty(saved)
    });
  } catch (error) {
    next(error);
  }
}

export async function getPurchases(req, res, next) {
  try {
    const {
      search,
      category,
      status,
      sortBy = 'purchaseDate',
      order = 'desc',
      page = 1,
      limit = 100
    } = req.query;

    const filter = { ownerId: req.user._id };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { productName: searchRegex },
        { seller: searchRegex }
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const now = new Date();
    const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const thirtyDaysEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 30, 23, 59, 59, 999));

    if (status === 'expired') {
      filter.warrantyExpiryDate = { $lt: todayMidnight };
    } else if (status === 'expiring_soon') {
      filter.warrantyExpiryDate = { $gte: todayMidnight, $lte: thirtyDaysEnd };
    } else if (status === 'active') {
      filter.warrantyExpiryDate = { $gt: thirtyDaysEnd };
    }

    const allowedSortFields = ['purchaseDate', 'warrantyExpiryDate', 'price', 'productName', 'seller', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'purchaseDate';
    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(200, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [total, records] = await Promise.all([
      PurchaseRecord.countDocuments(filter),
      PurchaseRecord.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
    ]);

    const augmented = records.map((r) => augmentPurchaseWithWarranty(r));

    res.status(200).json({
      success: true,
      count: augmented.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      purchases: augmented
    });
  } catch (error) {
    next(error);
  }
}

export async function getExpiringPurchases(req, res, next) {
  try {
    const now = new Date();
    const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const thirtyDaysEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 30, 23, 59, 59, 999));

    const records = await PurchaseRecord.find({
      ownerId: req.user._id,
      warrantyExpiryDate: { $gte: todayMidnight, $lte: thirtyDaysEnd }
    }).sort({ warrantyExpiryDate: 1 });

    const augmented = records.map((r) => augmentPurchaseWithWarranty(r));

    res.status(200).json({
      success: true,
      count: augmented.length,
      purchases: augmented
    });
  } catch (error) {
    next(error);
  }
}


export async function getPurchaseById(req, res, next) {
  try {
    const purchase = await PurchaseRecord.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase record not found or you do not have permission to access it.'
      });
    }

    res.status(200).json({
      success: true,
      purchase: augmentPurchaseWithWarranty(purchase)
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePurchase(req, res, next) {
  try {
    const purchase = await PurchaseRecord.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase record not found or you do not have permission to modify it.'
      });
    }

    const {
      productName,
      category,
      seller,
      purchaseDate,
      price,
      warrantyMonths,
      receiptUrl,
      notes
    } = req.body;

    let needsExpiryRecalculation = false;

    if (productName !== undefined) purchase.productName = productName.trim();
    if (category !== undefined) purchase.category = category;
    if (seller !== undefined) purchase.seller = seller.trim();
    if (price !== undefined) purchase.price = Number(price);
    if (receiptUrl !== undefined) purchase.receiptUrl = receiptUrl ? receiptUrl.trim() : '';
    if (notes !== undefined) purchase.notes = notes ? notes.trim() : '';

    if (purchaseDate !== undefined) {
      purchase.purchaseDate = new Date(purchaseDate);
      needsExpiryRecalculation = true;
    }

    if (warrantyMonths !== undefined) {
      purchase.warrantyMonths = Number(warrantyMonths);
      needsExpiryRecalculation = true;
    }

    if (needsExpiryRecalculation) {
      purchase.warrantyExpiryDate = calculateWarrantyExpiry(purchase.purchaseDate, purchase.warrantyMonths);
    }

    const updated = await purchase.save();

    res.status(200).json({
      success: true,
      message: 'Purchase record updated successfully.',
      purchase: augmentPurchaseWithWarranty(updated)
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePurchase(req, res, next) {
  try {
    const deleted = await PurchaseRecord.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Purchase record not found or you do not have permission to delete it.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Purchase record deleted successfully.',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
}
