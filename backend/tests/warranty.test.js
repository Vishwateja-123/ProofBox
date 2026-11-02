import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWarrantyExpiry,
  getWarrantyStatus,
  augmentPurchaseWithWarranty
} from '../src/utils/warrantyCalculator.js';

describe('Warranty Calculator Unit Tests', () => {
  it('correctly calculates expiry for standard 12-month duration', () => {
    const purchaseDate = '2025-06-15T00:00:00.000Z';
    const expiry = calculateWarrantyExpiry(purchaseDate, 12);

    assert.equal(expiry.getUTCFullYear(), 2026);
    assert.equal(expiry.getUTCMonth(), 5); // June (0-indexed)
    assert.equal(expiry.getUTCDate(), 15);
    assert.equal(expiry.getUTCHours(), 23);
    assert.equal(expiry.getUTCMinutes(), 59);
    assert.equal(expiry.getUTCSeconds(), 59);
  });

  it('correctly handles leap year February (Jan 31 in leap year 2024 -> Feb 29)', () => {
    const purchaseDate = '2024-01-31T00:00:00.000Z';
    const expiry = calculateWarrantyExpiry(purchaseDate, 1);

    assert.equal(expiry.getUTCFullYear(), 2024);
    assert.equal(expiry.getUTCMonth(), 1); // February
    assert.equal(expiry.getUTCDate(), 29); // 2024 is a leap year!
  });

  it('correctly handles non-leap year February (Jan 31 in non-leap year 2023 -> Feb 28)', () => {
    const purchaseDate = '2023-01-31T00:00:00.000Z';
    const expiry = calculateWarrantyExpiry(purchaseDate, 1);

    assert.equal(expiry.getUTCFullYear(), 2023);
    assert.equal(expiry.getUTCMonth(), 1); // February
    assert.equal(expiry.getUTCDate(), 28); // 2023 has 28 days
  });

  it('correctly handles 31-day month to 30-day month rollover (March 31 -> April 30)', () => {
    const purchaseDate = '2025-03-31T00:00:00.000Z';
    const expiry = calculateWarrantyExpiry(purchaseDate, 1);

    assert.equal(expiry.getUTCFullYear(), 2025);
    assert.equal(expiry.getUTCMonth(), 3); // April
    assert.equal(expiry.getUTCDate(), 30);
  });

  it('correctly handles 0-month warranty (expires on purchase date at end of day)', () => {
    const purchaseDate = '2025-10-10T12:00:00.000Z';
    const expiry = calculateWarrantyExpiry(purchaseDate, 0);

    assert.equal(expiry.getUTCFullYear(), 2025);
    assert.equal(expiry.getUTCMonth(), 9); // October
    assert.equal(expiry.getUTCDate(), 10);
    assert.equal(expiry.getUTCHours(), 23);
  });

  it('throws an error for invalid date input', () => {
    assert.throws(() => {
      calculateWarrantyExpiry('not-a-valid-date', 12);
    }, /Invalid purchase date/);
  });

  it('identifies active warranty when days remaining > 30', () => {
    const today = new Date(Date.UTC(2026, 0, 1)); // 2026-01-01
    const futureExpiry = new Date(Date.UTC(2026, 5, 1)); // 2026-06-01 (~151 days)

    const status = getWarrantyStatus(futureExpiry, today);
    assert.equal(status.status, 'active');
    assert.equal(status.isActive, true);
    assert.equal(status.isExpiringSoon, false);
    assert.equal(status.isExpired, false);
    assert(status.daysRemaining > 30);
  });

  it('identifies expiring-soon status at exactly 30 days remaining (inclusive)', () => {
    const today = new Date(Date.UTC(2026, 0, 1)); // 2026-01-01
    const expiry30Days = new Date(Date.UTC(2026, 0, 31)); // 2026-01-31 (30 days)

    const status = getWarrantyStatus(expiry30Days, today);
    assert.equal(status.status, 'expiring_soon');
    assert.equal(status.isExpiringSoon, true);
    assert.equal(status.daysRemaining, 30);
  });

  it('identifies expiring-soon status at zero days remaining (today)', () => {
    const today = new Date(Date.UTC(2026, 0, 1, 10, 0, 0));
    const expiryToday = new Date(Date.UTC(2026, 0, 1, 23, 59, 59));

    const status = getWarrantyStatus(expiryToday, today);
    assert.equal(status.status, 'expiring_soon');
    assert.equal(status.isExpiringSoon, true);
    assert.equal(status.daysRemaining, 0);
  });

  it('identifies expired status when days remaining < 0', () => {
    const today = new Date(Date.UTC(2026, 0, 10));
    const pastExpiry = new Date(Date.UTC(2026, 0, 5)); // 5 days ago

    const status = getWarrantyStatus(pastExpiry, today);
    assert.equal(status.status, 'expired');
    assert.equal(status.isExpired, true);
    assert.equal(status.daysRemaining, -5);
  });

  it('augmentPurchaseWithWarranty correctly enhances a purchase object', () => {
    const sampleRecord = {
      productName: 'MacBook Air M3',
      warrantyExpiryDate: new Date(Date.UTC(2027, 0, 1))
    };
    const referenceDate = new Date(Date.UTC(2026, 0, 1));
    const augmented = augmentPurchaseWithWarranty(sampleRecord, referenceDate);

    assert.equal(augmented.productName, 'MacBook Air M3');
    assert.equal(augmented.warrantyStatus, 'active');
    assert.equal(augmented.isActive, true);
    assert.equal(augmented.isExpired, false);
  });
});
