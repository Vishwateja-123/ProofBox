import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WarrantyBadge } from '../components/WarrantyBadge.jsx';

describe('WarrantyBadge Component', () => {
  it('renders Active badge with days remaining', () => {
    render(<WarrantyBadge status="active" daysRemaining={120} />);
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
    expect(screen.getByText(/120d/i)).toBeInTheDocument();
  });

  it('renders Expiring Soon badge within 30 days', () => {
    render(<WarrantyBadge status="expiring_soon" daysRemaining={14} />);
    expect(screen.getByText(/Expiring Soon/i)).toBeInTheDocument();
    expect(screen.getByText(/14d left/i)).toBeInTheDocument();
  });

  it('renders Expired badge when past warranty period', () => {
    render(<WarrantyBadge status="expired" daysRemaining={-10} />);
    expect(screen.getByText(/Expired/i)).toBeInTheDocument();
    expect(screen.getByText(/10d ago/i)).toBeInTheDocument();
  });
});
