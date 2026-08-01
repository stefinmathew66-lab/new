import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

const HERO_IMAGES = [
  "/images/silk_kanchipuram.png",
  "/images/banarasi_pink.png",
  "/images/organza_mint.png",
  "/images/georgette_indigo.png"
];

export default function Hero({ onExploreClick }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="hero-scroll-container">
      {/* Background Slideshow */}
      <div className="hero-bg-frame">
        {HERO_IMAGES.map((imgUrl, index) => (
          <img 
            key={index}
            src={imgUrl} 
            alt={`Luxury Saree Hero Slide ${index + 1}`} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: currentImageIndex === index ? 2 : 1,
              filter: 'brightness(0.7)'
            }}
          />
        ))}
        {/* Overlay curtain */}
        <div 
          className="hero-overlay-curtain" 
          style={{ zIndex: 3 }}
        />
      </div>

      {/* Main hero typography */}
      <div 
        className="hero-content-reveal"
        style={{ zIndex: 10 }}
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
