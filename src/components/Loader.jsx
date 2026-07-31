import React, { useEffect, useState } from 'react';

export default function Loader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              onFinish();
            }, 800); // Wait for the transition to finish
          }, 400); // Wait at 100% for a moment
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 120);

    return () => {
      clearInterval(timer);
    };
  }, [onFinish]);

  return (
    <div className={`loader-wrapper ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-brand velnora-logo-text">
        <span className="logo-letter logo-letter-v">v</span>
        <span className="logo-letter logo-letter-e">e</span>
        <span className="logo-l-wrapper logo-letter">
          l
          <svg className="logo-l-swash" viewBox="0 0 100 40" fill="currentColor">
            <path d="M 92 2 C 75 16, 50 24, 25 22 C 12 20, 2 14, 0 8 C 3 13, 12 18, 25 18 C 50 20, 75 12, 92 2 Z" />
          </svg>
        </span>
        <span className="logo-letter">n</span>
        <span className="logo-letter">o</span>
        <span className="logo-letter">r</span>
        <span className="logo-letter">a</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="loader-bar-bg">
          <div 
            className="loader-bar-fill" 
            style={{ width: `${progress}%`, animation: 'none' }} 
          />
        </div>
        <div 
          style={{ 
            marginTop: '1rem', 
            fontSize: '0.65rem', 
            fontFamily: 'var(--font-sans)', 
            letterSpacing: '0.2em',
            color: 'var(--accent-gold)'
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
