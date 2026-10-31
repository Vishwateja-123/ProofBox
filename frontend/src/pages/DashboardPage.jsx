import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  ArrowRight,
  Plus,
  Clock,
  ExternalLink,
  Receipt,
  Tag,
  Store,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService.js';
import { StatCard } from '../components/StatCard.jsx';
import { WarrantyBadge } from '../components/WarrantyBadge.jsx';
import { ReceiptModal } from '../components/ReceiptModal.jsx';
import { formatCurrency, formatDate } from '../utils/dateUtils.js';

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardSummary();
        if (res.success) {
          setSummary(res.summary);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
        <div style={{ height: '220px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }} />
        <div className="metric-ribbon">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: '110px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
        <p style={{ color: 'var(--status-expired-text)', marginBottom: '1.25rem', fontSize: '1rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary btn-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    totalPurchases = 0,
    activeWarranties = 0,
    expiringSoon = 0,
    expiredWarranties = 0,
    totalSpend = 0,
    categoryBreakdown = [],
    recentPurchases = [],
    upcomingExpirations = []
  } = summary || {};

  return (
    <div>
      {/* Apple-Caliber Editorial Hero Section */}
      <section className="hero-editorial">
        <div className="hero-editorial-badge">
          <Sparkles size={14} />
          <span>ProofBox Personal Vault</span>
        </div>
        <h1 className="hero-editorial-headline">
          Everything you own. Beautifully protected.
        </h1>
        <p className="hero-editorial-lead">
          Your purchases, receipts, and warranties. One beautifully organized place.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/purchases" className="btn btn-primary btn-lg">
            <span>Explore My Products</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/purchases/new" className="btn btn-secondary btn-lg">
            <Plus size={16} />
            <span>Add a Purchase</span>
          </Link>
        </div>
      </section>

      {/* Editorial Metric Ribbon */}
      <section className="metric-ribbon">
        <StatCard
          title="Protected Value"
          value={formatCurrency(totalSpend)}
          subtext={`${totalPurchases} registered ${totalPurchases === 1 ? 'item' : 'items'}`}
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Warranties"
          value={activeWarranties}
          subtext="Healthy manufacturer coverage"
          icon={ShieldCheck}
        />
        <StatCard
          title="Expiring Soon"
          value={expiringSoon}
          subtext="Within 30-day window"
          icon={ShieldAlert}
        />
        <StatCard
          title="Expired Coverage"
          value={expiredWarranties}
          subtext="Past warranty period"
          icon={AlertOctagon}
        />
      </section>

      {/* Urgent Expiry Notice if applicable */}
      {expiringSoon > 0 && (
        <div
          style={{
            background: 'var(--status-expiring-bg)',
            border: '1px solid var(--status-expiring-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--status-expiring-text)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--status-expiring-text)', fontSize: '0.95rem' }}>
                Action Recommended: {expiringSoon} {expiringSoon === 1 ? 'warranty expires' : 'warranties expire'} within 30 days
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Review these records now to schedule maintenance or submit claims while coverage is active.
              </div>
            </div>
          </div>

          <Link to="/expiring" className="btn btn-secondary btn-sm" style={{ background: '#FFFFFF' }}>
            <span>Review Items</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Two Column Grid: Warranty Radar & Category Vault */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Upcoming Expirations Timeline (Warranty Radar) */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '600' }}>Warranty Radar</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Upcoming expiration schedule</p>
            </div>
            <Link
              to="/warranties"
              style={{ fontSize: '0.85rem', fontWeight: '500' }}
            >
              View all
            </Link>
          </div>

          {upcomingExpirations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              No upcoming warranty expirations found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingExpirations.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingRight: '0.75rem' }}>
                    <Link
                      to={`/purchases/${item._id}`}
                      style={{
                        fontWeight: '600',
                        fontSize: '0.925rem',
                        color: 'var(--text-primary)',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.productName}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Expires {formatDate(item.warrantyExpiryDate)}
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    <WarrantyBadge
                      status={item.warrantyStatus}
                      daysRemaining={item.daysRemaining}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Vault Distribution */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '600' }}>Vault Distribution</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Protected assets by category</p>
            </div>
            <Link
              to="/purchases"
              style={{ fontSize: '0.85rem', fontWeight: '500' }}
            >
              Filter by category
            </Link>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              No categories recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {categoryBreakdown.map((cat) => {
                const percent = totalSpend > 0 ? Math.round((cat.totalSpend / totalSpend) * 100) : 0;
                return (
                  <div key={cat._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{cat._id}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                        {cat.count} {cat.count === 1 ? 'item' : 'items'} • {formatCurrency(cat.totalSpend)}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: 'var(--primary)',
                          borderRadius: 'var(--radius-full)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recently Added Products Collection */}
      <section className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recently Added to Vault</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your most recent purchase records and warranty coverage</p>
          </div>
          <Link
            to="/purchases"
            className="btn btn-secondary btn-sm"
          >
            <span>All Products</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {recentPurchases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingBag size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Your Vault is Empty</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', fontSize: '0.875rem' }}>
              Add your first purchase to track warranties and securely store receipts.
            </p>
            <Link to="/purchases/new" className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Add First Purchase</span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {recentPurchases.map((item) => (
              <div
                key={item._id}
                style={{
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="category-tag">
                    <Tag size={12} />
                    <span>{item.category}</span>
                  </span>
                  <WarrantyBadge
                    status={item.warrantyStatus}
                    daysRemaining={item.daysRemaining}
                  />
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <Link
                    to={`/purchases/${item._id}`}
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.productName}
                  </Link>
                </h3>

                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  {formatCurrency(item.price)}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Store size={13} style={{ color: 'var(--text-tertiary)' }} />
                    <span>{item.seller}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={13} style={{ color: 'var(--text-tertiary)' }} />
                    <span>Purchased {formatDate(item.purchaseDate)}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {item.receiptUrl ? (
                    <button
                      onClick={() => setSelectedReceipt({ url: item.receiptUrl, name: item.productName })}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Receipt size={13} />
                      <span>Receipt</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No receipt</span>
                  )}

                  <Link
                    to={`/purchases/${item._id}`}
                    className="btn btn-subtle btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <span>Details</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receiptUrl={selectedReceipt.url}
          productName={selectedReceipt.name}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}

export default DashboardPage;
