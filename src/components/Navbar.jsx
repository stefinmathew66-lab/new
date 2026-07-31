import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ cartCount, onCartClick, onViewChange, currentView, atmosphere, onAtmosphereToggle }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
    if (currentView !== 'storefront') {
      onViewChange('storefront');
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
    <>
      {/* Top Announcement Bar integrated with Navbar */}
      <nav className={`navbar-glass ${isScrolled ? 'scrolled' : ''}`}>
        {/* Announcement Bar */}
        <div className="announcement-bar">
          <span>SILK MARK CERTIFIED</span>
          <span className="bullet">✦</span>
          <span>AUTHENTIC SAREES</span>
          <span className="bullet">✦</span>
          <span>FREE SHIPPING OVER ₹15,000</span>
        </div>

        {/* Row 1: Logo & Icons */}
        <div className="nav-row-main container">
          {/* Left Side: Mobile Toggle (Storefront only) */}
          <div className="nav-col-left">
            {currentView === 'storefront' && (
              <button 
                className="nav-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.25rem'
                }}
              >
                {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            )}
          </div>

          {/* Center Column: Logo */}
          <div 
            onClick={() => {
              onViewChange('storefront');
              setIsMobileMenuOpen(false);
            }}
            className="nav-logo-text"
            style={{ cursor: 'pointer' }}
          >
            THE VELNORA
          </div>

          {/* Right Column: Actions */}
          <div className="nav-col-right">
            {currentView === 'storefront' && (
              <button
                onClick={onAtmosphereToggle}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-primary)',
                  padding: '0.25rem',
                  gap: '0.4rem'
                }}
                title={`Switch to ${atmosphere === 'ivory' ? 'Midnight Lounge' : 'Ivory Studio'}`}
              >
                {atmosphere === 'ivory' ? (
                  <>
                    <Moon size={18} strokeWidth={1.5} />
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }} className="nav-links-desktop">Lounge</span>
                  </>
                ) : (
                  <>
                    <Sun size={18} strokeWidth={1.5} />
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }} className="nav-links-desktop">Studio</span>
                  </>
                )}
              </button>
            )}

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

            <button 
              onClick={() => {
                onViewChange(currentView === 'admin' ? 'storefront' : 'admin');
                setIsMobileMenuOpen(false);
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: currentView === 'admin' ? 'var(--accent-gold)' : 'var(--text-primary)',
                gap: '0.25rem'
              }}
              title="Admin Panel"
              className="nav-admin-btn"
            >
              <User size={20} strokeWidth={1.5} />
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }} className="nav-admin-label">
                {currentView === 'admin' ? 'Dashboard' : 'Admin'}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Desktop Menu Links */}
        {currentView === 'storefront' ? (
          <div className="nav-row-links nav-links-desktop">
            <span onClick={() => handleNavClick('hero')} className="nav-link-item">Home</span>
            <span onClick={() => handleNavClick('shop')} className="nav-link-item">Collection</span>
            <span onClick={() => handleNavClick('heritage')} className="nav-link-item">Heritage</span>
            <span onClick={() => handleNavClick('contact')} className="nav-link-item">Contact</span>
          </div>
        ) : (
          <div className="nav-row-links nav-links-desktop">
            <span onClick={() => onViewChange('storefront')} className="nav-link-item">← Back to Store</span>
          </div>
        )}
      </nav>

      {/* Slide Down Mobile Menu */}
      {currentView === 'storefront' && (
        <div 
          className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-color)',
            zIndex: 890,
            overflow: 'hidden',
            maxHeight: 0,
            transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span 
              onClick={() => handleNavClick('hero')} 
              style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.5rem' }}
            >
              Home
            </span>
            <span 
              onClick={() => handleNavClick('shop')} 
              style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.5rem' }}
            >
              Collection
            </span>
            <span 
              onClick={() => handleNavClick('heritage')} 
              style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.5rem' }}
            >
              Heritage
            </span>
            <span 
              onClick={() => handleNavClick('contact')} 
              style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', paddingBottom: '0.5rem' }}
            >
              Contact
            </span>
          </div>
        </div>
      )}
    </>
  );
}
