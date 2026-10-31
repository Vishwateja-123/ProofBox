import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarClock,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  ArrowUpDown,
  Search,
  ExternalLink,
  Receipt,
  Sparkles,
  ChevronRight,
  Store,
  Calendar
} from 'lucide-react';
import { purchaseService } from '../services/purchaseService.js';
import { formatDate, formatCurrency } from '../utils/dateUtils.js';
import { WarrantyBadge } from '../components/WarrantyBadge.jsx';
import { ReceiptModal } from '../components/ReceiptModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function WarrantyTrackerPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'expiring_soon' | 'expired'
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc'); // default asc (soonest expiry first)
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await purchaseService.getPurchases({
          search,
          status: activeTab,
          sortBy: 'warrantyExpiryDate',
          order
        });
        if (res.success) {
          setPurchases(res.purchases);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load warranties', 'error');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadData, 200);
    return () => clearTimeout(timer);
  }, [activeTab, search, order, showToast]);

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-editorial-badge" style={{ marginBottom: '0.4rem' }}>
          <Sparkles size={13} />
          <span>Active Protection Intelligence</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
          Coverage, made clear.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Authoritative timeline tracking and countdowns for all registered product warranties ({purchases.length} records)
        </p>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Warranties
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <ShieldCheck size={14} />
              <span>Active</span>
            </button>
            <button
              onClick={() => setActiveTab('expiring_soon')}
              className={`btn btn-sm ${activeTab === 'expiring_soon' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <ShieldAlert size={14} />
              <span>Expiring Soon (30d)</span>
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`btn btn-sm ${activeTab === 'expired' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <AlertOctagon size={14} />
              <span>Expired</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem', paddingRight: '0.75rem', fontSize: '0.85rem', padding: '0.5rem 0.75rem 0.5rem 2.25rem' }}
                placeholder="Filter by product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              title={`Order: ${order === 'asc' ? 'Soonest Expiry First' : 'Furthest Expiry First'}`}
              aria-label="Toggle sort order"
            >
              <ArrowUpDown size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Warranties List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{ height: '110px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}
            />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CalendarClock size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>No Warranties Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
            No records matched your selected warranty filter criteria.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {purchases.map((item) => {
            const pDate = new Date(item.purchaseDate).getTime();
            const eDate = new Date(item.warrantyExpiryDate).getTime();
            const now = Date.now();
            const totalDuration = eDate - pDate;
            const elapsed = Math.max(0, now - pDate);
            const progressPercent = totalDuration > 0 ? Math.min(100, Math.round((elapsed / totalDuration) * 100)) : 100;

            return (
              <div
                key={item._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="category-tag">{item.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        Purchased {formatDate(item.purchaseDate)} from {item.seller}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      <Link
                        to={`/purchases/${item._id}`}
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.productName}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {formatCurrency(item.price)} • {item.warrantyMonths} Months Manufacturer Term
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.785rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        Expiration Date
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {formatDate(item.warrantyExpiryDate)}
                      </div>
                    </div>

                    <WarrantyBadge
                      status={item.warrantyStatus}
                      daysRemaining={item.daysRemaining}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {item.receiptUrl && (
                        <button
                          onClick={() => setSelectedReceipt({ url: item.receiptUrl, name: item.productName })}
                          className="btn btn-secondary btn-icon"
                          title="View Receipt"
                          aria-label="View Receipt"
                        >
                          <Receipt size={14} />
                        </button>
                      )}
                      <Link
                        to={`/purchases/${item._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: '0.25rem' }}>
                  <div className="timeline-bar-wrapper">
                    <div
                      className={`timeline-bar-fill ${
                        item.warrantyStatus === 'expired'
                          ? 'expired'
                          : item.warrantyStatus === 'expiring_soon'
                          ? 'expiring'
                          : 'active'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    <span>{progressPercent}% elapsed</span>
                    <span>
                      {item.daysRemaining > 0
                        ? `${item.daysRemaining} days remaining`
                        : `Expired ${Math.abs(item.daysRemaining)} days ago`}
                    </span>
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

export default WarrantyTrackerPage;
