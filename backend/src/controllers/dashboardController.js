import PurchaseRecord from '../models/PurchaseRecord.js';
import { augmentPurchaseWithWarranty } from '../utils/warrantyCalculator.js';

export async function getDashboardSummary(req, res, next) {
  try {
    const ownerId = req.user._id;
    const now = new Date();
    const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const thirtyDaysEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 30, 23, 59, 59, 999));

    const [
      totalPurchases,
      activeCount,
      expiringSoonCount,
      expiredCount,
      spendAgg,
      categoryAgg,
      recentRecords,
      upcomingRecords
    ] = await Promise.all([
      PurchaseRecord.countDocuments({ ownerId }),
      PurchaseRecord.countDocuments({
        ownerId,
        warrantyExpiryDate: { $gt: thirtyDaysEnd }
      }),
      PurchaseRecord.countDocuments({
        ownerId,
        warrantyExpiryDate: { $gte: todayMidnight, $lte: thirtyDaysEnd }
      }),
      PurchaseRecord.countDocuments({
        ownerId,
        warrantyExpiryDate: { $lt: todayMidnight }
      }),
      PurchaseRecord.aggregate([
        { $match: { ownerId } },
        { $group: { _id: null, totalSpend: { $sum: '$price' } } }
      ]),

      PurchaseRecord.aggregate([
        { $match: { ownerId } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: '$price' }
          }
        },
        { $sort: { count: -1 } }
      ]),

      PurchaseRecord.find({ ownerId })
        .sort({ purchaseDate: -1, createdAt: -1 })
        .limit(5),

      PurchaseRecord.find({
        ownerId,
        warrantyExpiryDate: { $gte: todayMidnight }
      })
        .sort({ warrantyExpiryDate: 1 })
        .limit(5)
    ]);

    const totalSpend = spendAgg.length > 0 ? spendAgg[0].totalSpend : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalPurchases,
        activeWarranties: activeCount,
        expiringSoon: expiringSoonCount,
        expiredWarranties: expiredCount,
        totalSpend: Math.round(totalSpend * 100) / 100,
        categoryBreakdown: categoryAgg.map((item) => ({
          category: item._id,
          count: item.count,
          totalValue: Math.round(item.totalValue * 100) / 100
        })),
        recentPurchases: recentRecords.map((r) => augmentPurchaseWithWarranty(r)),
        upcomingExpirations: upcomingRecords.map((r) => augmentPurchaseWithWarranty(r))
      }
    });
  } catch (error) {
    next(error);
  }
}
