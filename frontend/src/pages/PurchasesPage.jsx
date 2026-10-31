import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  ShoppingBag,
  ArrowUpDown,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { purchaseService } from '../services/purchaseService.js';
import { PurchaseCard } from '../components/PurchaseCard.jsx';
import { PurchaseTable } from '../components/PurchaseTable.jsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.jsx';
import { ReceiptModal } from '../components/ReceiptModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

const CATEGORIES = [
  'All',
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

export function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('purchaseDate');
  const [order, setOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const { showToast } = useToast();

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await purchaseService.getPurchases({
        search,
        category: selectedCategory,
        status: statusFilter,
        sortBy,
        order
      });
      if (res.success) {
        setPurchases(res.purchases);
        setTotal(res.total);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch purchases', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPurchases();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, statusFilter, sortBy, order]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await purchaseService.deletePurchase(deleteTarget._id);
      showToast(`"${deleteTarget.productName}" deleted successfully.`, 'success');
      setDeleteTarget(null);
      fetchPurchases();
    } catch (err) {
      showToast(err.message || 'Failed to delete record.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setStatusFilter('all');
    setSortBy('purchaseDate');
    setOrder('desc');
  };

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
            My Products
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Your personal collection of verified purchases and active warranties ({total} {total === 1 ? 'item' : 'items'})
          </p>
        </div>

        <Link to="/purchases/new" className="btn btn-primary">
          <Plus size={16} />
          <span>Add Purchase</span>
        </Link>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search products or sellers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Warranty Status Filter */}
          <div style={{ flex: '0 1 170px' }}>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by warranty status"
            >
              <option value="all">All Warranties</option>
              <option value="active">Active Only</option>
              <option value="expiring_soon">Expiring Soon (30d)</option>
              <option value="expired">Expired Only</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div style={{ flex: '0 1 160px' }}>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort records by"
            >
              <option value="purchaseDate">Purchase Date</option>
              <option value="warrantyExpiryDate">Warranty Expiry</option>
              <option value="price">Price</option>
              <option value="productName">Product Name</option>
            </select>
          </div>

          {/* Order Toggle (Asc/Desc) */}
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            title={`Sort ${order === 'asc' ? 'Ascending' : 'Descending'}`}
            aria-label="Toggle sort order"
          >
            <ArrowUpDown size={15} />
          </button>

          {/* View Mode Toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--bg-canvas)', padding: '0.2rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ width: '30px', height: '30px', padding: 0 }}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`btn-icon ${viewMode === 'table' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ width: '30px', height: '30px', padding: 0 }}
              title="Table View"
              aria-label="Table view"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Active Filters Row */}
        {(search || selectedCategory !== 'All' || statusFilter !== 'all') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active filters:</span>
            {search && (
              <span className="category-tag">
                Search: "{search}"
                <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSearch('')} />
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="category-tag">
                Category: {selectedCategory}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="category-tag">
                Status: {statusFilter.replace('_', ' ')}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setStatusFilter('all')} />
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', marginLeft: '0.5rem' }}
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main Content View */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                height: '240px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}
            />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>No Products Found</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem' }}>
            {search || selectedCategory !== 'All' || statusFilter !== 'all'
              ? 'No purchase records match your search criteria. Try adjusting or clearing your filters.'
              : 'You have not added any product records to your vault yet.'}
          </p>
          {search || selectedCategory !== 'All' || statusFilter !== 'all' ? (
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear All Filters
            </button>
          ) : (
            <Link to="/purchases/new" className="btn btn-primary">
              <Plus size={15} />
              <span>Add Your First Product</span>
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {purchases.map((purchase) => (
            <PurchaseCard
              key={purchase._id}
              purchase={purchase}
              onPreviewReceipt={(url, name) => setSelectedReceipt({ url, name })}
              onDeleteRequest={(item) => setDeleteTarget(item)}
            />
          ))}
        </div>
      ) : (
        <PurchaseTable
          purchases={purchases}
          onPreviewReceipt={(url, name) => setSelectedReceipt({ url, name })}
          onDeleteRequest={(item) => setDeleteTarget(item)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.productName}
        loading={deleteLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Receipt Lightbox Modal */}
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

export default PurchasesPage;
