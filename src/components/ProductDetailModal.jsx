import React from 'react';
import { X, ShoppingBag, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Left Aspect Image */}
        <div className="modal-left">
          <img 
            src={product.image} 
            alt={product.title} 
            className="modal-detail-img" 
          />
        </div>

        {/* Right Aspect Details */}
        <div className="modal-right">
          <span className="uppercase-track text-gold" style={{ marginBottom: '0.5rem', display: 'block' }}>
            {product.category} Collection
          </span>
          <h2 className="modal-title">{product.title}</h2>
          
          <div className="modal-price">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <p className="modal-desc">
            {product.description}
          </p>

          {/* Product Technical Spec Sheet */}
          <div className="modal-specs">
            <div>
              <div className="spec-item-lbl">Material Weave</div>
              <div className="spec-item-val">{product.material || "Pure Silk"}</div>
            </div>
            <div>
              <div className="spec-item-lbl">Zari Details</div>
              <div className="spec-item-val">{product.zari || "Pure Zari borders"}</div>
            </div>
            <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(30,28,26,0.04)', paddingTop: '0.75rem' }}>
              <div className="spec-item-lbl">Care & Maintenance</div>
              <div className="spec-item-val" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>{product.care || "Dry clean only"}</div>
            </div>
          </div>

          {/* Stock Notification */}
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span 
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: isOutOfStock ? '#E53935' : product.stock <= 3 ? '#FB8C00' : '#43A047',
                display: 'inline-block' 
              }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {isOutOfStock ? 'Sold Out' : product.stock <= 3 ? `Limited stock: ${product.stock} units remaining` : 'In Stock (Ready to Dispatch)'}
            </span>
          </div>

          {/* Action Trigger */}
          <button 
            className="btn-premium"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            style={{ 
              width: '100%', 
              opacity: isOutOfStock ? 0.5 : 1, 
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <ShoppingBag size={16} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Collection Bag'}
          </button>

          {/* Trust badges */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '2rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.65rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={14} className="text-gold" />
              100% Authentic Handloom
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={14} className="text-gold" />
              Pure Zari Certified
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={14} className="text-gold" />
              Secure Shipping
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
