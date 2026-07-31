import React, { useState, useEffect } from 'react';
import { ShoppingBag, User } from 'lucide-react';

export default function Navbar({ cartCount, onCartClick, onViewChange, currentView }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    if (currentView !== 'storefront') {
      onViewChange('storefront');
      // Wait for view switch to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar-glass ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => onViewChange('storefront')}
          style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.75rem', 
            letterSpacing: '0.15em', 
            fontWeight: '400',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          MANMEETGAY
        </div>

        {/* Navigation links */}
        {currentView === 'storefront' ? (
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="nav-links-desktop">
            <span 
              onClick={() => handleNavClick('hero')} 
              style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Home
            </span>
            <span 
              onClick={() => handleNavClick('shop')} 
              style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Collection
            </span>
            <span 
              onClick={() => handleNavClick('heritage')} 
              style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Heritage
            </span>
            <span 
              onClick={() => handleNavClick('contact')} 
              style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Contact
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <span 
              onClick={() => onViewChange('storefront')} 
              style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              ← Back to Store
            </span>
          </div>
        )}

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {currentView === 'storefront' && (
            <button 
              onClick={onCartClick}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-primary)'
              }}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--accent-gold)',
                    color: 'var(--text-primary)',
                    fontSize: '0.6rem',
                    fontWeight: '700',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}
