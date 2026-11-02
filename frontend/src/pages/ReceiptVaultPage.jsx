import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  ExternalLink,
  Eye,
  FileText,
  ShoppingBag,
  Store,
  Calendar,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';
import { purchaseService } from '../services/purchaseService.js';
import { formatDate, formatCurrency } from '../utils/dateUtils.js';
import { ReceiptModal } from '../components/ReceiptModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function ReceiptVaultPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadReceipts() {
      try {
        setLoading(true);
        const res = await purchaseService.getPurchases({ limit: 100 });
        if (res.success) {
          const withReceipts = res.purchases.filter(
            (p) => p.receiptUrl && p.receiptUrl.trim() !== ''
          );
          setReceipts(withReceipts);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load receipts', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadReceipts();
  }, [showToast]);

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-editorial-badge" style={{ marginBottom: '0.4rem' }}>
          <Sparkles size={13} />
          <span>Document Vault</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
          Every receipt. Right where you need it.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Centralized gallery of all invoices, paper receipts, and PDF warranty documentation ({receipts.length} stored)
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{ height: '260px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}
            />
          ))}
        </div>
      ) : receipts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Receipt size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>No Receipts Attached Yet</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem' }}>
            Attach receipt links or upload invoices when creating or editing product records to store them safely here.
          </p>
          <Link to="/purchases" className="btn btn-secondary">
            Browse My Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
          {receipts.map((item) => {
            const isPdf = item.receiptUrl.toLowerCase().endsWith('.pdf');
            return (
              <div
                key={item._id}
                className="card card-flush"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Thumbnail Header */}
                <div
                  onClick={() => setSelectedReceipt({ url: item.receiptUrl, name: item.productName })}
                  style={{
                    height: '170px',
                    background: 'var(--bg-canvas)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}
                  title="Click to expand receipt"
                >
                  {isPdf ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <FileText size={44} style={{ color: 'var(--primary)', marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>PDF Invoice</div>
                    </div>
                  ) : (
                    <img
                      src={item.receiptUrl}
                      alt={`Receipt for ${item.productName}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.25s ease'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML =
                          '<div style="text-align:center;color:var(--text-tertiary);"><span style="font-size:0.8rem;font-weight:600;">Receipt Image Attached</span></div>';
                      }}
                    />
                  )}
                </div>

                {/* Card Meta Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span className="category-tag">{item.category}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      {formatDate(item.purchaseDate)}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                    <Link
                      to={`/purchases/${item._id}`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.productName}
                    </Link>
                  </h3>

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {formatCurrency(item.price)} • {item.seller}
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                      onClick={() => setSelectedReceipt({ url: item.receiptUrl, name: item.productName })}
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>

                    <a
                      href={item.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-subtle btn-sm"
                      title="Open file in new tab"
                    >
                      <ExternalLink size={13} />
                      <span>Open Link</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
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

export default ReceiptVaultPage;
