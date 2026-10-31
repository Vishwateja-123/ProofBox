import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, calculateLocalExpiry } from '../utils/dateUtils.js';

describe('Frontend Date and Currency Utilities', () => {
  it('formats valid dates to readable US string', () => {
    const formatted = formatDate('2026-05-15T00:00:00.000Z');
    expect(formatted).toMatch(/May 15, 2026|15 May 2026/);
  });

  it('preserves exact calendar date for UTC end-of-day warranty expiries without timezone day shift', () => {
    // 2026-05-15T23:59:59.999Z should format as May 15, 2026, never May 16
    const formatted = formatDate('2026-05-15T23:59:59.999Z');
    expect(formatted).toMatch(/May 15, 2026|15 May 2026/);
  });

  it('handles invalid or empty dates gracefully', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('invalid-date')).toBe('—');
  });

  it('formats amounts into INR currency representation', () => {
    const formatted = formatCurrency(49999);
    expect(formatted).toContain('49,999');
  });

  it('calculates local expiry date and status correctly for 12 months', () => {
    const res = calculateLocalExpiry('2026-01-01', 12);
    expect(res).not.toBeNull();
    expect(res.expiryDate.getUTCFullYear()).toBe(2027);
    expect(res.expiryDate.getUTCMonth()).toBe(0); // January
  });

  it('handles month-end clamping (Jan 31 + 1 month in leap year 2024 -> Feb 29)', () => {
    const res = calculateLocalExpiry('2024-01-31', 1);
    expect(res.expiryDate.getUTCFullYear()).toBe(2024);
    expect(res.expiryDate.getUTCMonth()).toBe(1); // Feb
    expect(res.expiryDate.getUTCDate()).toBe(29);
  });
});
