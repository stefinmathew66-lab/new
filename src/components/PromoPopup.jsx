import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles } from 'lucide-react';
import './PromoPopup.css';

export default function PromoPopup({ isOpen, onClose, product, onClaim }) {
  if (!isOpen || !product) return null;

  // 15-minute countdown timer (900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const discountAmount = Math.round(product.price * 0.15);
  const promoPrice = product.price - discountAmount;

  return (
    <div className="promo-overlay" onClick={onClose}>
      <div className="promo-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Option */}
        <button className="promo-close-btn" onClick={onClose} aria-label="Close Promo">
          <X size={18} />
        </button>

        {/* Left Side: Product Image */}
        <div className="promo-card-left">
          <img src={product.image} alt={product.title} className="promo-product-img" />
          <div className="promo-img-overlay">
            <span className="promo-tag">LIMITED RELEASE</span>
          </div>
        </div>

        {/* Right Side: Offer and Details */}
        <div className="promo-card-right">
          <div className="promo-brand">THE VELNORA</div>
          
          <div className="promo-offer-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>ARTISAN SPECIAL</span>
          </div>

          <div className="promo-offer-center">
            <h2>15% OFF</h2>
            <div className="promo-offer-subtitle">Exclusive Heritage Celebration</div>
          </div>

          <div className="promo-product-details">
            <p className="promo-product-category">{product.category} • {product.subcategory || 'Handloom'}</p>
            <h3 className="promo-product-title">{product.title}</h3>
            
            <div className="promo-price-box">
              <span className="promo-price-original">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="promo-price-discounted">₹{promoPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="promo-timer">
            <Clock size={14} />
            <span>Offer expires in <strong className="timer-digits">{formatTime(timeLeft)}</strong></span>
          </div>

          {/* Action CTA */}
          <button 
            className="promo-btn-claim" 
            onClick={() => onClaim(product)}
          >
            Claim Offer & Shop Now
          </button>
        </div>

      </div>
    </div>
  );
}
