/**
 * ProofBox — Date & Currency Formatting Utilities
 */

export function formatDate(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  // Use UTC timezone so that end-of-day expiry dates (23:59:59.999Z)
  // do not roll over to the next day in timezones east of UTC (e.g. IST +05:30).
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Real-time calculation preview for forms
 */
export function calculateLocalExpiry(purchaseDateInput, warrantyMonths = 0) {
  if (!purchaseDateInput) return null;
  const purchaseDate = new Date(purchaseDateInput);
  if (isNaN(purchaseDate.getTime())) return null;

  const months = Math.max(0, parseInt(warrantyMonths, 10) || 0);
  const year = purchaseDate.getUTCFullYear();
  const month = purchaseDate.getUTCMonth();
  const day = purchaseDate.getUTCDate();

  const totalMonths = month + months;
  const targetYear = year + Math.floor(totalMonths / 12);
  const targetMonth = totalMonths % 12;

  const maxDaysInTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, maxDaysInTargetMonth);

  const expiry = new Date(Date.UTC(targetYear, targetMonth, targetDay, 23, 59, 59, 999));

  // Determine status and days
  const now = new Date();
  const refMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const expiryMidnight = Date.UTC(expiry.getUTCFullYear(), expiry.getUTCMonth(), expiry.getUTCDate());
  const daysRemaining = Math.round((expiryMidnight - refMidnight) / (1000 * 60 * 60 * 24));

  let status = 'active';
  if (daysRemaining < 0) status = 'expired';
  else if (daysRemaining <= 30) status = 'expiring_soon';

  return {
    expiryDate: expiry,
    daysRemaining,
    status
  };
}
