import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Receipt } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/dateUtils.js';
import { WarrantyBadge } from './WarrantyBadge.jsx';

export function PurchaseTable({ purchases, onPreviewReceipt, onDeleteRequest }) {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Purchase Date</th>
            <th>Warranty Expiry</th>
            <th>Status</th>
            <th>Receipt</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase._id}>
              <td>
                <Link
                  to={`/purchases/${purchase._id}`}
                  style={{ fontWeight: '600', color: 'var(--text-primary)' }}
                >
                  {purchase.productName}
                </Link>
              </td>
              <td>
                <span className="category-tag">{purchase.category}</span>
              </td>
              <td>{purchase.seller}</td>
              <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                {formatCurrency(purchase.price)}
              </td>
              <td>{formatDate(purchase.purchaseDate)}</td>
              <td>
                <div style={{ fontWeight: '500' }}>{formatDate(purchase.warrantyExpiryDate)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {purchase.warrantyMonths} months
                </div>
              </td>
              <td>
                <WarrantyBadge
                  status={purchase.warrantyStatus}
                  daysRemaining={purchase.daysRemaining}
                />
              </td>
              <td>
                {purchase.receiptUrl ? (
                  <button
                    onClick={() => onPreviewReceipt(purchase.receiptUrl, purchase.productName)}
                    className="btn btn-secondary btn-sm"
                    title="View Receipt"
                  >
                    <Receipt size={13} />
                    <span>View</span>
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>—</span>
                )}
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                  <Link
                    to={`/purchases/${purchase._id}`}
                    className="btn btn-secondary btn-icon"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link
                    to={`/purchases/${purchase._id}/edit`}
                    className="btn btn-secondary btn-icon"
                    title="Edit Record"
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button
                    onClick={() => onDeleteRequest(purchase)}
                    className="btn btn-danger btn-icon"
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseTable;
