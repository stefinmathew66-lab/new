import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onCardClick, onQuickAdd }) {
  const isLowStock = product.stock <= 3 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  // Generate realistic mock discount/original price
  let discount = 30;
  if (product.id === 'prod-2') discount = 35;
  if (product.id === 'prod-3') discount = 40;
  if (product.id === 'prod-4') discount = 25;
  if (product.id === 'prod-5') discount = 45;
  
  const originalPrice = Math.round((product.price / (1 - discount / 100)) / 100) * 100;

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
          <div className="product-badge sold-out">
            Sold Out
          </div>
        ) : (
          <div className="product-badge save-badge">
            SAVE {discount}%
          </div>
        )}

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

      {/* Text meta details - centered layout */}
      <div className="product-meta centered-meta">
        <h3 className="product-title">{product.title}</h3>
        <span className="product-type">{product.category} Saree</span>
        <div className="product-price-row">
          <span className="product-price-sale">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="product-price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
