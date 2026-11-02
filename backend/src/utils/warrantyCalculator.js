/**
 * ProofBox — Warranty Calculator Utility
 * Authoritative date-math and status calculation engine
 * Handles leap years, month-end rollovers, UTC consistency, and edge cases.
 */

/**
 * Accurately calculates the warranty expiry date given a purchase date and warranty duration in months.
 * Ensures month-end clamping (e.g. Jan 31 + 1 month = Feb 28/29, NOT March 2/3).
 *
 * @param {Date|string} purchaseDateInput - The purchase date
 * @param {number} warrantyMonths - Duration in months (>= 0)
 * @returns {Date} Calculated expiry date in UTC at 23:59:59.999
 */
export function calculateWarrantyExpiry(purchaseDateInput, warrantyMonths = 0) {
  const purchaseDate = new Date(purchaseDateInput);
  if (isNaN(purchaseDate.getTime())) {
    throw new Error('Invalid purchase date provided for warranty calculation');
  }

  const months = Math.max(0, parseInt(warrantyMonths, 10) || 0);

  // Extract UTC components from the purchase date
  const year = purchaseDate.getUTCFullYear();
  const month = purchaseDate.getUTCMonth(); // 0-indexed
  const day = purchaseDate.getUTCDate();

  // If 0 months warranty, expires on the purchase date at end-of-day
  if (months === 0) {
    return new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  }

  // Calculate target year and target month
  const totalMonths = month + months;
  const targetYear = year + Math.floor(totalMonths / 12);
  const targetMonth = totalMonths % 12;

  // Determine maximum days in the target month (handles leap year for Feb)
  // Day 0 of targetMonth + 1 gives the last day of targetMonth
  const maxDaysInTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, maxDaysInTargetMonth);

  // Set expiry to end of that calendar day in UTC
  return new Date(Date.UTC(targetYear, targetMonth, targetDay, 23, 59, 59, 999));
}

/**
 * Computes the real-time warranty status and remaining days relative to a reference date (default: now).
 *
 * Status definition:
 * - 'expired': daysRemaining < 0
 * - 'expiring_soon': 0 <= daysRemaining <= 30 (inclusive 30-day window)
 * - 'active': daysRemaining > 30
 *
 * @param {Date|string} expiryDateInput - Stored or calculated warranty expiry date
 * @param {Date|string} [referenceDateInput] - Optional reference date (defaults to current time)
 * @returns {{ status: 'active'|'expiring_soon'|'expired', daysRemaining: number, isExpiringSoon: boolean, isExpired: boolean, isActive: boolean }}
 */
export function getWarrantyStatus(expiryDateInput, referenceDateInput = new Date()) {
  const expiryDate = new Date(expiryDateInput);
  const referenceDate = new Date(referenceDateInput);

  if (isNaN(expiryDate.getTime())) {
    return {
      status: 'unknown',
      daysRemaining: 0,
      isExpiringSoon: false,
      isExpired: false,
      isActive: false
    };
  }

  // Normalize reference date to start of UTC day for fair calendar-day difference
  const refUtcMidnight = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate()
  );

  const expiryUtcMidnight = Date.UTC(
    expiryDate.getUTCFullYear(),
    expiryDate.getUTCMonth(),
    expiryDate.getUTCDate()
  );

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round((expiryUtcMidnight - refUtcMidnight) / msPerDay);

  let status = 'active';
  if (daysRemaining < 0) {
    status = 'expired';
  } else if (daysRemaining <= 30) {
    status = 'expiring_soon';
  }

  return {
    status,
    daysRemaining,
    isExpiringSoon: status === 'expiring_soon',
    isExpired: status === 'expired',
    isActive: status === 'active'
  };
}

/**
 * Enhances a raw purchase record document or object with dynamic warranty status fields
 *
 * @param {object} purchase - Raw purchase document/object
 * @param {Date} [referenceDate] - Optional reference date
 * @returns {object} Augmented purchase object
 */
export function augmentPurchaseWithWarranty(purchase, referenceDate = new Date()) {
  if (!purchase) return null;
  const obj = typeof purchase.toObject === 'function' ? purchase.toObject() : { ...purchase };
  const statusInfo = getWarrantyStatus(obj.warrantyExpiryDate, referenceDate);
  return {
    ...obj,
    warrantyStatus: statusInfo.status,
    daysRemaining: statusInfo.daysRemaining,
    isExpiringSoon: statusInfo.isExpiringSoon,
    isExpired: statusInfo.isExpired,
    isActive: statusInfo.isActive
  };
}
