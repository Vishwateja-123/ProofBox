import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--status-expired-text)' }}>
            <AlertTriangle size={18} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)' }}>Confirm Record Deletion</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-primary)', marginBottom: '0.65rem', fontSize: '0.95rem' }}>
            Are you sure you want to permanently delete{' '}
            <strong>{itemName || 'this product record'}</strong>?
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            This action removes the purchase record, its warranty calculations, and attached receipt links from your personal vault.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
