import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Save,
  Tag,
  Store,
  Shield,
  Receipt,
  Upload,
  Clock,
  ExternalLink,
  Sparkles,
  FileText
} from 'lucide-react';
import { purchaseService } from '../services/purchaseService.js';
import { calculateLocalExpiry, formatDate, formatCurrency } from '../utils/dateUtils.js';
import { WarrantyBadge } from '../components/WarrantyBadge.jsx';
import { useToast } from '../context/ToastContext.jsx';

const CATEGORIES = [
  'Electronics',
  'Appliances',
  'Vehicles',
  'Furniture',
  'Clothing',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Tools & Hardware',
  'Other'
];

export function AddPurchasePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    productName: '',
    category: 'Electronics',
    seller: '',
    purchaseDate: todayStr,
    price: '',
    warrantyMonths: 12,
    receiptUrl: '',
    notes: ''
  });

  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Real-time warranty calculation preview
  const warrantyPreview = useMemo(() => {
    return calculateLocalExpiry(formData.purchaseDate, formData.warrantyMonths);
  }, [formData.purchaseDate, formData.warrantyMonths]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Local receipt file upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingReceipt(true);
    try {
      const res = await purchaseService.uploadReceipt(file);
      if (res.success && res.receiptUrl) {
        setFormData((prev) => ({ ...prev, receiptUrl: res.receiptUrl }));
        showToast('Receipt file uploaded successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload receipt file', 'error');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.seller.trim()) newErrors.seller = 'Seller is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive amount';
    }
    if (formData.warrantyMonths === '' || isNaN(formData.warrantyMonths) || Number(formData.warrantyMonths) < 0) {
      newErrors.warrantyMonths = 'Warranty duration must be 0 or more months';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted errors before saving.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await purchaseService.createPurchase({
        ...formData,
        price: Number(formData.price),
        warrantyMonths: Number(formData.warrantyMonths)
      });

      if (res.success) {
        showToast('Product and warranty record saved to vault!', 'success');
        navigate(`/purchases/${res.purchase._id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to save purchase record.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.75rem' }}>
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
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="hero-editorial-badge" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={13} />
            <span>New Protection Record</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Add something worth keeping.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Register your purchase, calculate verified warranty coverage, and attach receipt evidence.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Product Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              1. Product Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="productName">
                  Product Name *
                </label>
                <input
                  id="productName"
                  name="productName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. MacBook Air M3, Sony WH-1000XM5"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
                {errors.productName && <span className="form-error">{errors.productName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="seller">
                Seller / Retailer *
              </label>
              <input
                id="seller"
                name="seller"
                type="text"
                className="form-control"
                placeholder="e.g. Apple Store, Amazon, Reliance Digital"
                value={formData.seller}
                onChange={handleChange}
                required
              />
              {errors.seller && <span className="form-error">{errors.seller}</span>}
            </div>
          </div>

          {/* Section 2: Purchase & Valuation */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              2. Purchase & Value
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Purchase Price (₹) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  placeholder="e.g. 134900"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="purchaseDate">
                  Purchase Date *
                </label>
                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  className="form-control"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                />
                {errors.purchaseDate && <span className="form-error">{errors.purchaseDate}</span>}
              </div>
            </div>
          </div>

          {/* Section 3: Warranty Coverage */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              3. Warranty Coverage
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="warrantyMonths">
                Warranty Duration (Months) *
              </label>
              <input
                id="warrantyMonths"
                name="warrantyMonths"
                type="number"
                min="0"
                step="1"
                className="form-control"
                value={formData.warrantyMonths}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Standard coverage: 12 months (1 year), 24 months (2 years), 36 months (3 years)</span>
              {errors.warrantyMonths && <span className="form-error">{errors.warrantyMonths}</span>}
            </div>

            {/* Interactive Live Expiry Preview */}
            {warrantyPreview && (
              <div
                style={{
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <Clock size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Calculated Warranty Expiration
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {formatDate(warrantyPreview.expiryDate)}
                    </div>
                  </div>
                </div>

                <WarrantyBadge
                  status={warrantyPreview.status}
                  daysRemaining={warrantyPreview.daysRemaining}
                />
              </div>
            )}
          </div>

          {/* Section 4: Documentation & Receipt */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              4. Proof of Purchase & Receipt
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="receiptUrl">
                Receipt / Invoice URL
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  id="receiptUrl"
                  name="receiptUrl"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/receipt.pdf or receipt image link"
                  value={formData.receiptUrl}
                  onChange={handleChange}
                />
                {formData.receiptUrl && (
                  <a
                    href={formData.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-icon"
                    title="Test receipt URL in new tab"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
              <span className="form-hint">
                Supports image links (JPG, PNG, WEBP), Cloud drive URLs, and PDF documents.
              </span>
            </div>

            {/* Local File Upload */}
            <div
              style={{
                padding: '1.25rem',
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-strong)',
                marginTop: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Or Upload File from Your Mac
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Image or PDF up to 10MB stored securely in your private vault
                  </div>
                </div>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <Upload size={14} />
                  <span>{uploadingReceipt ? 'Uploading...' : 'Choose File'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingReceipt}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 5: Additional Details */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              5. Serial Number & Notes (Optional)
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">
                Notes & Coverage Clauses
              </label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                placeholder="e.g. Serial: C02GM3PROOFBOX. AppleCare eligible. Customer care: 1800-XXX-XXXX."
                value={formData.notes}
                onChange={handleChange}
                maxLength={1000}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.85rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/purchases" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ minWidth: '150px' }}
            >
              <Save size={15} />
              <span>{submitting ? 'Saving...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPurchasePage;
