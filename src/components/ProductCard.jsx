import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onCardClick, onQuickAdd }) {
  const isLowStock = product.stock <= 3 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      onQuickAdd(product);
    }
  };

  return (
    <div 
      className="product-card reveal" 
      onClick={() => onCardClick(product)}
    >
      <div className="product-image-container">
        {/* Badge flags */}
        {isOutOfStock ? (
          <div className="product-badge" style={{ color: '#C62828', borderColor: '#FFCDD2', background: 'rgba(255,235,235,0.9)' }}>
            Sold Out
          </div>
        ) : isLowStock ? (
          <div className="product-badge" style={{ color: '#E65100', borderColor: '#FFE0B2', background: 'rgba(255,243,224,0.9)' }}>
            Only {product.stock} Left
          </div>
        ) : product.featured ? (
          <div className="product-badge">
            Signature Piece
          </div>
        ) : null}

        {/* Product image */}
        <img 
          src={product.image} 
          alt={product.title} 
          className="product-img" 
          loading="lazy"
        />
        {product.detailImage && (
          <img 
            src={product.detailImage} 
            alt={`${product.title} Detail`} 
            className="product-img-secondary" 
            loading="lazy"
          />
        )}

        {/* Hover slide action */}
        {!isOutOfStock && (
          <div className="product-overlay">
            <button 
              className="btn-card-add"
              onClick={handleQuickAdd}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={12} />
                Quick Add
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Text meta details */}
      <div className="product-meta">
        <div>
          <h3 className="product-title">{product.title}</h3>
          <span className="product-type">{product.category} Saree</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.material && (
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.2rem', letterSpacing: '0.05em' }}>
              {product.material.split(' ').slice(-2).join(' ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
