import PurchaseRecord from '../models/PurchaseRecord.js';
import { augmentPurchaseWithWarranty } from '../utils/warrantyCalculator.js';

/**
 * Get dashboard summary metrics and statistics
 * GET /api/dashboard/summary
 */
export async function getDashboardSummary(req, res, next) {
  try {
    const ownerId = req.user._id;
    const now = new Date();
    const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const thirtyDaysEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 30, 23, 59, 59, 999));

    // Parallel aggregation for lightning-fast performance
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
      // 1. Total purchases
      PurchaseRecord.countDocuments({ ownerId }),

      // 2. Active count (> 30 days)
      PurchaseRecord.countDocuments({
        ownerId,
        warrantyExpiryDate: { $gt: thirtyDaysEnd }
      }),

      // 3. Expiring soon count (between today midnight and 30 days)
      PurchaseRecord.countDocuments({
        ownerId,
        warrantyExpiryDate: { $gte: todayMidnight, $lte: thirtyDaysEnd }
      }),

      // 4. Expired count (< today midnight)
      PurchaseRecord.countDocuments({
        ownerId,
        warrantyExpiryDate: { $lt: todayMidnight }
      }),

      // 5. Total spend aggregation
      PurchaseRecord.aggregate([
        { $match: { ownerId } },
        { $group: { _id: null, totalSpend: { $sum: '$price' } } }
      ]),

      // 6. Category breakdown
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

      // 7. Recent 5 purchases
      PurchaseRecord.find({ ownerId })
        .sort({ purchaseDate: -1, createdAt: -1 })
        .limit(5),

      // 8. Upcoming 5 expirations (active and expiring soon, sorted ascending)
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
