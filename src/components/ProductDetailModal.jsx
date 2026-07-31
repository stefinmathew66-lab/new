import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Sparkles, RefreshCw, Compass } from 'lucide-react';

const STEPS = [
  {
    title: "1. Raw Silk Selection",
    summary: "Mulberry Cultivation",
    desc: "We select the highest grade raw mulberry silk. The silk filaments are carefully gathered and hand-spun on charkha looms to build high tensile strength and rich natural luster."
  },
  {
    title: "2. Natural Dyeing",
    summary: "Copper Vat Infusions",
    desc: "Spun threads are washed and dipped into copper vats infused with natural dye extracts (like indigo, madder, turmeric) to achieve rich, long-lasting color tones."
  },
  {
    title: "3. Pure Gold Zari twisting",
    summary: "Gold & Silver Twists",
    desc: "Artisans wrap fine silver wires around natural silk threads, then dip the strands in pure gold bath. Woven zari contains certified silver and pure gold content."
  },
  {
    title: "4. Setting the Weave Canvas",
    summary: "Loom Drafting",
    desc: "Setting up the warp (vertical) threads on the wooden handloom, drafting the pattern cards that guide the weave motif (e.g. temple borders, peacocks)."
  },
  {
    title: "5. Handloom Brocading",
    summary: "Double-Shuttle Weaving",
    desc: "Two weavers coordinate shuttles, manually interweaving the gold zari over the silk. Woven at a rate of just 2-3 inches per day, creating a unique signature piece."
  }
];

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'loom'
  const [activeStep, setActiveStep] = useState(0);

  const isOutOfStock = product.stock === 0;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Left Aspect Image */}
        <div className="modal-left" style={{ position: 'relative' }}>
          <img 
            src={product.image} 
            alt={product.title} 
            className="modal-detail-img" 
          />
          {product.detailImage && (
            <div 
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                background: 'rgba(30, 28, 26, 0.75)',
                color: '#FFFFFF',
                padding: '0.4rem 0.8rem',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(4px)',
                pointerEvents: 'none'
              }}
            >
              Artisan Weave Detail Preview
            </div>
          )}
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

          {/* Premium Tab Switches */}
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.25rem' }}>
            <button 
              onClick={() => setActiveTab('specs')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: activeTab === 'specs' ? 'var(--accent-gold-dark)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'specs' ? '2px solid var(--accent-gold-dark)' : '2px solid transparent',
                paddingBottom: '0.5rem',
                transition: 'var(--transition-fast)'
              }}
            >
              Specifications
            </button>
            <button 
              onClick={() => setActiveTab('loom')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: activeTab === 'loom' ? 'var(--accent-gold-dark)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'loom' ? '2px solid var(--accent-gold-dark)' : '2px solid transparent',
                paddingBottom: '0.5rem',
                transition: 'var(--transition-fast)'
              }}
            >
              The Loom Journey
            </button>
          </div>

          {/* TAB CONTENT: SPECS SHEET */}
          {activeTab === 'specs' && (
            <>
              <p className="modal-desc">
                {product.description}
              </p>

              {/* Technical specifications */}
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
            </>
          )}

          {/* TAB CONTENT: LOOM JOURNEY TIMELINE */}
          {activeTab === 'loom' && (
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1rem', fontStyle: 'italic' }}>
                Tap on any step of the legacy lifecycle to read details:
              </span>
              
              <div className="loom-stepper">
                {STEPS.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`loom-step ${activeStep === idx ? 'active' : ''}`}
                    onClick={() => setActiveStep(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="loom-step-bullet" />
                    <div className="loom-step-title" style={{ color: activeStep === idx ? 'var(--accent-gold-dark)' : 'var(--text-primary)' }}>
                      {step.title}
                    </div>
                    <div className="loom-step-desc">
                      {step.summary}
                      {activeStep === idx && (
                        <div 
                          style={{ 
                            marginTop: '0.5rem', 
                            padding: '0.75rem 1rem', 
                            background: 'var(--bg-secondary)', 
                            borderRadius: '4px',
                            color: 'var(--text-secondary)', 
                            fontSize: '0.75rem',
                            lineHeight: '1.5',
                            borderLeft: '2px solid var(--accent-gold)'
                          }}
                        >
                          {step.desc}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
