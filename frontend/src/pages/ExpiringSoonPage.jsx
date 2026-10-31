import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  ExternalLink,
  Store,
  Receipt,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { purchaseService } from '../services/purchaseService.js';
import { formatDate, formatCurrency } from '../utils/dateUtils.js';
import { WarrantyBadge } from '../components/WarrantyBadge.jsx';
import { ReceiptModal } from '../components/ReceiptModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function ExpiringSoonPage() {
  const [expiringPurchases, setExpiringPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadExpiring() {
      try {
        setLoading(true);
        const res = await purchaseService.getExpiringPurchases();
        if (res.success) {
          setExpiringPurchases(res.purchases);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load expiring warranties', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadExpiring();
  }, [showToast]);

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-editorial-badge" style={{ marginBottom: '0.4rem' }}>
          <Sparkles size={13} />
          <span>30-Day Expiration Radar</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
          A little reminder. Right on time.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Items expiring within the inclusive 30-day window ({expiringPurchases.length} {expiringPurchases.length === 1 ? 'item requires' : 'items require'} attention)
        </p>
      </div>

      {/* Advisory Checklist Card */}
      <div
        style={{
          background: 'var(--status-expiring-bg)',
          border: '1px solid var(--status-expiring-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.25rem'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--status-expiring-text)',
            boxShadow: 'var(--shadow-xs)',
            flexShrink: 0
          }}
        >
          <ClipboardCheck size={20} />
        </div>
        <div>
          <h2 style={{ color: 'var(--status-expiring-text)', fontWeight: '600', fontSize: '1rem', marginBottom: '0.35rem' }}>
            Recommended Preparation Checklist
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
            Before manufacturer coverage lapses, verify that your hardware is operating normally:
          </p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <li>Inspect for battery health degradation, hardware issues, or cosmetic damage.</li>
            <li>Verify your purchase invoice is downloaded or stored in the ProofBox Vault.</li>
            <li>Locate serial numbers on the physical product or packaging before filing a claim.</li>
          </ul>
        </div>
      </div>

      {/* Expiring Items List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ height: '140px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}
            />
          ))}
        </div>
      ) : expiringPurchases.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--status-active-bg)',
              color: 'var(--status-active-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <CheckCircle2 size={30} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '0.5rem' }}>You're all set.</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.75rem', fontSize: '0.925rem' }}>
            None of your registered product warranties are expiring in the next 30 days. Your purchase vault remains fully protected.
          </p>
          <Link to="/purchases" className="btn btn-secondary">
            <span>Explore All Products</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {expiringPurchases.map((item) => (
            <div
              key={item._id}
              className="card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}
            >
              <div style={{ flex: '1 1 320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span className="category-tag">{item.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    Purchased from {item.seller}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <Link
                    to={`/purchases/${item._id}`}
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.productName}
                  </Link>
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Valued at {formatCurrency(item.price)} • {formatDate(item.purchaseDate)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.785rem', color: 'var(--status-expiring-text)', fontWeight: '600', textTransform: 'uppercase' }}>
                    Expires In
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--status-expiring-text)' }}>
                    {item.daysRemaining} {item.daysRemaining === 1 ? 'day' : 'days'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    {formatDate(item.warrantyExpiryDate)}
                  </div>
                </div>

                <WarrantyBadge
                  status={item.warrantyStatus}
                  daysRemaining={item.daysRemaining}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {item.receiptUrl && (
                    <button
                      onClick={() => setSelectedReceipt({ url: item.receiptUrl, name: item.productName })}
                      className="btn btn-secondary btn-sm"
                      title="Inspect Receipt"
                    >
                      <Receipt size={14} />
                      <span>Receipt</span>
                    </button>
                  )}
                  <Link
                    to={`/purchases/${item._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <span>View Product</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReceipt && (
        <ReceiptModal
          isOpen={!!selectedReceipt}
          receiptUrl={selectedReceipt.url}
          productName={selectedReceipt.name}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}

export default ExpiringSoonPage;
