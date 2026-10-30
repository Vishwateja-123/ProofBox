import React, { useState } from 'react';
import { X, ExternalLink, FileText, ImageOff } from 'lucide-react';

export function ReceiptModal({ isOpen = true, onClose, receiptUrl, productName }) {
  const [loadError, setLoadError] = useState(false);

  if (!isOpen || !receiptUrl) return null;

  const isPdf = receiptUrl.toLowerCase().endsWith('.pdf') || receiptUrl.includes('application/pdf');

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Receipt & Invoice Evidence
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {productName || 'Purchase Record'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-icon"
              title="Open full receipt in new tab"
              aria-label="Open in new tab"
            >
              <ExternalLink size={15} />
            </a>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-icon"
              aria-label="Close modal"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div
          className="modal-body"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            background: 'var(--bg-canvas)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          {isPdf ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <FileText size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>PDF Invoice Document</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                This receipt is archived as a high-fidelity PDF document.
              </p>
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <ExternalLink size={14} />
                <span>Open PDF Document</span>
              </a>
            </div>
          ) : loadError ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <ImageOff size={44} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
              <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Unable to preview receipt directly</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                The linked URL may have cross-origin restrictions or require external opening.
              </p>
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={14} />
                <span>Open URL in New Tab</span>
              </a>
            </div>
          ) : (
            <img
              src={receiptUrl}
              alt={`Receipt for ${productName || 'Purchase'}`}
              onError={() => setLoadError(true)}
              style={{
                maxWidth: '100%',
                maxHeight: '62vh',
                borderRadius: 'var(--radius-md)',
                objectFit: 'contain',
                boxShadow: 'var(--shadow-md)'
              }}
            />
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.785rem', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '360px' }}>
            {receiptUrl}
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
