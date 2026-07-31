import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax calculations
  const imageScale = 1.1 - Math.min(scrollY * 0.0003, 0.1);
  const textTranslateY = scrollY * 0.4;
  const overlayOpacity = Math.min(0.2 + (scrollY * 0.0015), 0.7);

  return (
    <section id="hero" className="hero-scroll-container">
      {/* Background image container with scroll-linked scaling */}
      <div 
        className="hero-bg-frame"
        style={{
          transform: `scale(${imageScale})`,
        }}
      >
        <img 
          src="/images/silk_kanchipuram.png" 
          alt="Luxury Silk Saree Close Up" 
          className="hero-image-zoom"
          style={{
            transform: `translateY(${scrollY * 0.05}px)`
          }}
        />
        <div 
          className="hero-overlay-curtain" 
          style={{ 
            backgroundColor: `rgba(30, 28, 26, ${overlayOpacity})` 
          }}
        />
      </div>

      {/* Main hero typography with scroll-linked translation & fade */}
      <div 
        className="hero-content-reveal"
        style={{
          transform: `translateY(${textTranslateY}px)`,
          opacity: Math.max(1 - (scrollY * 0.002), 0)
        }}
      >
        <h4 className="hero-subtitle-sub">
          THE ART OF HANDLOOM WEAVING
        </h4>
        <h1 className="hero-title-main">
          Zari & Grace
        </h1>
        <p 
          style={{ 
            fontFamily: 'var(--font-sans)', 
            fontSize: '0.9rem', 
            letterSpacing: '0.05em', 
            color: 'rgba(255,255,255,0.85)', 
            maxWidth: '500px', 
            margin: '0 auto 3rem auto',
            lineHeight: 1.6
          }}
        >
          Discover curated heirloom sarees woven with pure gold zari, exquisite mulberry silk, and legacy craftsmanship.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <button onClick={onExploreClick} className="btn-premium" style={{ background: '#FFFFFF', color: '#12100E', borderColor: '#FFFFFF' }}>
            View Catalog
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#FFFFFF',
          opacity: Math.max(1 - (scrollY * 0.004), 0),
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Scroll Down</span>
        <ArrowDown size={14} className="scroll-arrow-anim" style={{ animation: 'bounce 2s infinite' }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
          60% { transform: translateY(-3px); }
        }
      `}</style>
    </section>
  );
}
