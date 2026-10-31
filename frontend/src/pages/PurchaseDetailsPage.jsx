import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Store,
  Tag,
  Receipt,
  Clock,
  Shield,
  ExternalLink,
  FileText,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { purchaseService } from '../services/purchaseService.js';
import { formatDate, formatCurrency, formatDateTime } from '../utils/dateUtils.js';
import { WarrantyBadge } from '../components/WarrantyBadge.jsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.jsx';
import { ReceiptModal } from '../components/ReceiptModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function PurchaseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    async function loadPurchase() {
      try {
        setLoading(true);
        const res = await purchaseService.getPurchaseById(id);
        if (res.success && res.purchase) {
          setPurchase(res.purchase);
        }
      } catch (err) {
        showToast(err.message || 'Purchase record not found', 'error');
        navigate('/purchases');
      } finally {
        setLoading(false);
      }
    }

    loadPurchase();
  }, [id, navigate, showToast]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await purchaseService.deletePurchase(id);
      showToast(`"${purchase.productName}" deleted successfully.`, 'success');
      navigate('/purchases');
    } catch (err) {
      showToast(err.message || 'Failed to delete record.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '3rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!purchase) return null;

  // Calculate elapsed progress percentage
  const pDate = new Date(purchase.purchaseDate).getTime();
  const eDate = new Date(purchase.warrantyExpiryDate).getTime();
  const now = Date.now();
  const totalDuration = eDate - pDate;
  const elapsed = Math.max(0, now - pDate);
  const progressPercent = totalDuration > 0 ? Math.min(100, Math.round((elapsed / totalDuration) * 100)) : 100;

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Top Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          to="/purchases"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Products</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link to={`/purchases/${id}/edit`} className="btn btn-secondary btn-sm">
            <Edit3 size={14} />
            <span>Edit Record</span>
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Product Header Card */}
      <article className="card" style={{ padding: '2.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <span className="category-tag">
                <Tag size={12} />
                <span>{purchase.category}</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                Added {formatDateTime(purchase.createdAt)}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {purchase.productName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              <Store size={15} style={{ color: 'var(--text-tertiary)' }} />
              <span>Purchased from <strong style={{ color: 'var(--text-primary)' }}>{purchase.seller}</strong></span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Purchase Price
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginTop: '0.2rem' }}>
              {formatCurrency(purchase.price)}
            </div>
          </div>
        </div>

        {/* Coverage Timeline Section */}
        <div
          style={{
            background: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
                Coverage Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem' }}>
                <WarrantyBadge
                  status={purchase.warrantyStatus}
                  daysRemaining={purchase.daysRemaining}
                />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {purchase.warrantyMonths} months total duration
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expires On</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                {formatDate(purchase.warrantyExpiryDate)}
              </div>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="timeline-bar-wrapper">
            <div
              className={`timeline-bar-fill ${
                purchase.warrantyStatus === 'expired'
                  ? 'expired'
                  : purchase.warrantyStatus === 'expiring_soon'
                  ? 'expiring'
                  : 'active'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            <span>Purchased {formatDate(purchase.purchaseDate)}</span>
            <span>
              {purchase.daysRemaining > 0
                ? `${purchase.daysRemaining} days remaining (${progressPercent}% elapsed)`
                : `Expired ${Math.abs(purchase.daysRemaining)} days ago`}
            </span>
          </div>
        </div>

        {/* Purchase Record Metadata Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Purchase Date</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{formatDate(purchase.purchaseDate)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Seller / Retailer</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{purchase.seller}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Category</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{purchase.category}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Vault Record ID</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.785rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              {purchase._id}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {purchase.notes && (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Serial Number & Personal Notes
            </h3>
            <div
              style={{
                background: 'var(--bg-canvas)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {purchase.notes}
            </div>
          </div>
        )}
      </article>

      {/* Receipt Proof Section */}
      <article className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Receipt size={18} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '600' }}>Proof of Purchase & Receipt</h2>
          </div>

          {purchase.receiptUrl && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowReceiptModal(true)}
                className="btn btn-primary btn-sm"
              >
                <span>View Full Receipt</span>
              </button>
              <a
                href={purchase.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </a>
            </div>
          )}
        </div>

        {purchase.receiptUrl ? (
          <div
            onClick={() => setShowReceiptModal(true)}
            style={{
              cursor: 'pointer',
              background: 'var(--bg-canvas)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '220px',
              transition: 'border-color 0.15s ease'
            }}
          >
            {purchase.receiptUrl.toLowerCase().endsWith('.pdf') ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <FileText size={44} style={{ color: 'var(--primary)', marginBottom: '0.75rem' }} />
                <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Stored PDF Invoice Document</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                  Click to inspect or download
                </p>
              </div>
            ) : (
              <img
                src={purchase.receiptUrl}
                alt={`Receipt for ${purchase.productName}`}
                style={{
                  maxHeight: '280px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
            )}
            <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Click to inspect receipt preview
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              background: 'var(--bg-canvas)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-strong)'
            }}
          >
            <AlertCircle size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No receipt linked to this purchase</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
              Add a receipt URL or upload an image file to keep proof of purchase safe in your vault.
            </p>
            <Link to={`/purchases/${id}/edit`} className="btn btn-secondary btn-sm">
              <Edit3 size={13} />
              <span>Attach Receipt</span>
            </Link>
          </div>
        )}
      </article>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemName={purchase.productName}
        loading={deleteLoading}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* Receipt Lightbox Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        receiptUrl={purchase.receiptUrl}
        productName={purchase.productName}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
}

export default PurchaseDetailsPage;
