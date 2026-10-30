import React from 'react';
import { ShieldCheck, Clock, AlertOctagon } from 'lucide-react';

export function WarrantyBadge({ status, daysRemaining, showDays = true }) {
  if (status === 'expired') {
    const daysAgo = Math.abs(daysRemaining);
    return (
      <span className="badge badge-expired" title="Warranty has expired">
        <AlertOctagon size={13} />
        <span>Expired{showDays ? (daysAgo > 0 ? ` (${daysAgo}d ago)` : '') : ''}</span>
      </span>
    );
  }

  if (status === 'expiring_soon') {
    return (
      <span className="badge badge-expiring" title="Expires within 30 days">
        <Clock size={13} />
        <span>
          Expiring Soon
          {showDays ? (daysRemaining === 0 ? ' (Today!)' : ` (${daysRemaining}d left)`) : ''}
        </span>
      </span>
    );
  }

  return (
    <span className="badge badge-active" title="Warranty is currently active">
      <ShieldCheck size={13} />
      <span>Active{showDays && daysRemaining ? ` (${daysRemaining}d)` : ''}</span>
    </span>
  );
}
