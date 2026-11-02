import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Shield,
  Check,
  ChevronRight,
  X,
  ExternalLink,
  Layers,
  Palette,
  HardDrive,
  Info
} from 'lucide-react';
import { productCatalogService } from '../services/productCatalogService.js';

export function ProductVisualSearch({
  query = '',
  onSelectProduct,
  onClose,
  standalone = false
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [imageLoaded, setImageLoaded] = useState(true);

  // Debounced search when query changes
  useEffect(() => {
    let active = true;
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const matches = await productCatalogService.search(query);
        if (!active) return;
        setResults(matches);

        // Auto-select the first top match for instant visual exploration
        if (matches && matches.length > 0) {
          const top = matches[0];
          setSelectedProduct(top);
          setSelectedColorIndex(0);
          setSelectedVariantId(top.variants?.[0]?.id || null);
          setSelectedModel(top.models?.[0] || top.name);
        } else {
          setSelectedProduct(null);
        }
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(fetchMatches, query ? 180 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // When selectedProduct changes, reset variant and model
  const handleProductPick = (product) => {
    setSelectedProduct(product);
    setSelectedColorIndex(0);
    setSelectedVariantId(product.variants?.[0]?.id || null);
    setSelectedModel(product.models?.[0] || product.name);
    setImageLoaded(false);
  };

  const handleColorPick = (index) => {
    if (index === selectedColorIndex) return;
    setImageLoaded(false);
    setSelectedColorIndex(index);
  };

  // Calculate pricing based on chosen variant
  const activeColor = selectedProduct?.colors?.[selectedColorIndex] || selectedProduct?.colors?.[0];
  const activeVariant = selectedProduct?.variants?.find((v) => v.id === selectedVariantId) || selectedProduct?.variants?.[0];
  const calculatedPrice = (selectedProduct?.basePrice || 0) + (activeVariant?.priceDelta || 0);

  const handleApply = () => {
    if (!selectedProduct || !onSelectProduct) return;

    // Construct full descriptive product title in Apple format:
    // e.g. "iPhone 16 Pro 256GB - Desert Titanium"
    const parts = [selectedModel || selectedProduct.name];
    if (activeVariant?.label && !activeVariant.label.toLowerCase().includes('standard')) {
      // If label has capacity like "256 GB"
      const shortVariant = activeVariant.label.split('/')[0].trim();
      parts.push(shortVariant);
    }
    if (activeColor?.name && activeColor.name !== 'Standard Edition') {
      parts.push(`- ${activeColor.name}`);
    }

    const constructedName = parts.join(' ').replace(/\s+-\s+/, ' - ');

    onSelectProduct({
      productName: constructedName,
      category: selectedProduct.category || 'Electronics',
      seller: selectedProduct.defaultSeller || 'Apple Store',
      price: calculatedPrice,
      warrantyMonths: selectedProduct.defaultWarrantyMonths || 12,
      previewImage: activeColor?.image || '',
      colorName: activeColor?.name || '',
      brand: selectedProduct.brand || ''
    });
  };

  if (!results.length && !loading) {
    return null;
  }

  return (
    <div
      className="card visual-search-container"
      style={{
        marginTop: '0.75rem',
        marginBottom: '1.75rem',
        padding: '1.5rem',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFBFD 100%)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative'
      }}
    >
      {/* Header bar with Apple-inspired visual indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-full)',
              background: '#000000',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Sparkles size={13} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Visual Product Explorer
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Accurate photos, official models, and finishes inspired by Apple.com
            </div>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn btn-subtle btn-icon"
            style={{ width: '28px', height: '28px' }}
            title="Dismiss product explorer"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Model Matching Carousel Chips */}
      {results.length > 1 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            Matching Products ({results.length})
          </div>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
              scrollbarWidth: 'none'
            }}
          >
            {results.map((prod) => {
              const isSelected = selectedProduct?.id === prod.id;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleProductPick(prod)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1.5px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--text-primary)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? '600' : '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {prod.colors?.[0]?.image && (
                    <img
                      src={prod.colors[0].image}
                      alt={prod.name}
                      style={{
                        width: '18px',
                        height: '18px',
                        objectFit: 'contain',
                        borderRadius: '2px'
                      }}
                      loading="lazy"
                    />
                  )}
                  <span>{prod.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Apple.com-style Interactive Stage */}
      {selectedProduct && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.75rem',
            alignItems: 'center',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Left: Product Hero Photo Stage */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem 1rem',
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
              borderRadius: 'var(--radius-md)',
              minHeight: '260px',
              overflow: 'hidden'
            }}
          >
            {/* Tagline / Brand Badge */}
            <div
              style={{
                position: 'absolute',
                top: '0.85rem',
                left: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-secondary)',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span>{selectedProduct.brand}</span>
              <span>•</span>
              <span>{selectedProduct.category}</span>
            </div>

            {/* Product Image with dynamic fade on color switch */}
            {activeColor?.image ? (
              <img
                src={activeColor.image}
                alt={`${selectedProduct.name} in ${activeColor.name}`}
                onLoad={() => setImageLoaded(true)}
                style={{
                  maxHeight: '220px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 14px 20px rgba(0, 0, 0, 0.12))',
                  opacity: imageLoaded ? 1 : 0.4,
                  transform: imageLoaded ? 'scale(1)' : 'scale(0.97)',
                  transition: 'opacity 0.25s ease, transform 0.25s ease'
                }}
                loading="eager"
              />
            ) : (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No photo available</div>
            )}

            {/* Active finish label at bottom of image stage */}
            <div
              style={{
                marginTop: '1rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--text-secondary)'
              }}
            >
              Finish — <span style={{ color: 'var(--text-primary)' }}>{activeColor?.name || 'Default'}</span>
            </div>
          </div>

          {/* Right: Model & Variant Configurator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: '0.2rem'
                }}
              >
                {selectedProduct.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {selectedProduct.tagline}
              </p>
            </div>

            {/* 1. Sub-model selector (e.g. 6.1" vs 6.7" or 13" vs 15") */}
            {selectedProduct.models && selectedProduct.models.length > 1 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Model / Size
                </label>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {selectedProduct.models.map((m) => {
                    const isModelActive = selectedModel === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedModel(m)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: isModelActive ? '600' : '500',
                          background: isModelActive ? 'var(--text-primary)' : 'var(--bg-canvas)',
                          color: isModelActive ? '#FFFFFF' : 'var(--text-primary)',
                          border: isModelActive ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Apple-grade Color Swatches */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
                  Choose Your Finish
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {selectedProduct.colors.map((color, idx) => {
                    const isColorActive = idx === selectedColorIndex;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorPick(idx)}
                        title={color.name}
                        aria-label={`Select ${color.name} finish`}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: color.hex || '#333333',
                          border: '2px solid #FFFFFF',
                          outline: isColorActive ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.2)',
                          outlineOffset: '2px',
                          cursor: 'pointer',
                          padding: 0,
                          transform: isColorActive ? 'scale(1.12)' : 'scale(1)',
                          transition: 'transform 0.15s ease, outline 0.15s ease',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Capacity / Variant Selector Chips */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
                  Configuration / Storage
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.45rem' }}>
                  {selectedProduct.variants.map((v) => {
                    const isVariantActive = v.id === selectedVariantId;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        style={{
                          padding: '0.5rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          textAlign: 'left',
                          background: isVariantActive ? '#F5F5F7' : '#FFFFFF',
                          border: isVariantActive ? '1.5px solid #000000' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{v.label}</div>
                        {v.priceDelta !== 0 && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                            {v.priceDelta > 0 ? `+$${v.priceDelta}` : `-$${Math.abs(v.priceDelta)}`}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Warranty & MSRP Coverage Intelligence Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                background: 'rgba(0, 0, 0, 0.03)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Shield size={14} style={{ color: 'var(--status-active-bar)' }} />
                <span>
                  <strong>{selectedProduct.defaultWarrantyMonths} Months</strong> Manufacturer Warranty
                </span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                ${calculatedPrice}
              </div>
            </div>

            {/* 5. Auto-Fill Action Button */}
            <button
              type="button"
              onClick={handleApply}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#000000',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Use This Product & Auto-Fill Details</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProductVisualSearch;
