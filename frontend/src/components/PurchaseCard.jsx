import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Receipt, Calendar, Store, Tag } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/dateUtils.js';
import { WarrantyBadge } from './WarrantyBadge.jsx';

export function PurchaseCard({ purchase, onPreviewReceipt, onDeleteRequest }) {
  return (
    <article className="product-card">
      <div className="product-card-top">
        <span className="category-tag">
          <Tag size={12} />
          <span>{purchase.category}</span>
        </span>
        <WarrantyBadge
          status={purchase.warrantyStatus}
          daysRemaining={purchase.daysRemaining}
        />
      </div>

      <h3 className="product-card-title">
        <Link to={`/purchases/${purchase._id}`}>
          {purchase.productName}
        </Link>
      </h3>

      <div className="product-card-price">
        {formatCurrency(purchase.price)}
      </div>

      <div className="product-meta-list">
        <div className="product-meta-row">
          <Store size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <span>Seller: <strong>{purchase.seller}</strong></span>
        </div>
        <div className="product-meta-row">
          <Calendar size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <span>Purchased: {formatDate(purchase.purchaseDate)}</span>
        </div>
        <div className="product-meta-row">
          <Calendar size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>Expires: <strong>{formatDate(purchase.warrantyExpiryDate)}</strong></span>
        </div>
      </div>

      <div className="product-card-footer">
        <div>
          {purchase.receiptUrl ? (
            <button
              onClick={() => onPreviewReceipt(purchase.receiptUrl, purchase.productName)}
              className="btn btn-secondary btn-sm"
              title="View stored receipt"
            >
              <Receipt size={13} />
              <span>Receipt</span>
            </button>
          ) : (
            <span style={{ fontSize: '0.785rem', color: 'var(--text-tertiary)' }}>No receipt</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Link
            to={`/purchases/${purchase._id}`}
            className="btn btn-secondary btn-icon"
            title="View Details"
            aria-label="View Details"
          >
            <Eye size={14} />
          </Link>
          <Link
            to={`/purchases/${purchase._id}/edit`}
            className="btn btn-secondary btn-icon"
            title="Edit Record"
            aria-label="Edit Record"
          >
            <Edit3 size={14} />
          </Link>
          <button
            onClick={() => onDeleteRequest(purchase)}
            className="btn btn-danger btn-icon"
            title="Delete Record"
            aria-label="Delete Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default PurchaseCard;
