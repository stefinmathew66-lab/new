import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  onCartClick, 
  onViewChange, 
  currentView, 
  atmosphere, 
  onAtmosphereToggle,
  selectedCategory,
  onCategoryChange
}) {
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

  const handleCategoryNav = (cat) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'storefront') {
      onViewChange('storefront');
    }
    onCategoryChange(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionNav = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'storefront') {
      onViewChange('storefront');
    }
    onCategoryChange('All');
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
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
                  display: 'flex',
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
              onCategoryChange('All');
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <span onClick={() => handleCategoryNav('All')} className={`nav-link-item ${selectedCategory === 'All' ? 'active' : ''}`}>Home</span>
            <span onClick={() => handleCategoryNav('Summer')} className={`nav-link-item ${selectedCategory === 'Summer' ? 'active' : ''}`}>Summer</span>
            <span onClick={() => handleCategoryNav('Sarees')} className={`nav-link-item ${selectedCategory === 'Sarees' ? 'active' : ''}`}>Sarees</span>
            <span onClick={() => handleCategoryNav('Suits')} className={`nav-link-item ${selectedCategory === 'Suits' ? 'active' : ''}`}>Suits</span>
            <span onClick={() => handleCategoryNav('Co-ords')} className={`nav-link-item ${selectedCategory === 'Co-ords' ? 'active' : ''}`}>Co-ords</span>
            <span onClick={() => handleSectionNav('heritage')} className="nav-link-item">Heritage</span>
            <span onClick={() => handleSectionNav('contact')} className="nav-link-item">Contact</span>
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
            maxHeight: isMobileMenuOpen ? '320px' : 0,
            transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <span 
              onClick={() => handleCategoryNav('All')} 
              style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}
            >
              Home
            </span>
            <span 
              onClick={() => handleCategoryNav('Summer')} 
              style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}
            >
              Summer Collection
            </span>
            <span 
              onClick={() => handleCategoryNav('Sarees')} 
              style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}
            >
              Heritage Sarees
            </span>
            <span 
              onClick={() => handleCategoryNav('Suits')} 
              style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}
            >
              Luxury Suits
            </span>
            <span 
              onClick={() => handleCategoryNav('Co-ords')} 
              style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}
            >
              Co-ords Sets
            </span>
            <span 
              onClick={() => handleSectionNav('heritage')} 
              style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}
            >
              Heritage
            </span>
            <span 
              onClick={() => handleSectionNav('contact')} 
              style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)', paddingBottom: '0.4rem' }}
            >
              Contact
            </span>
          </div>
        </div>
      )}
    </>
  );
}
