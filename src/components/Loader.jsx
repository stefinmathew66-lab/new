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
      <div className="loader-brand velnora-logo">
        <span className="logo-letter logo-letter-v">v</span>
        <span className="logo-letter logo-letter-e">e</span>
        <span className="logo-l-wrapper">
          <span className="logo-l-spacer">l</span>
          <svg className="logo-l-svg" viewBox="0 0 120 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 97 10 H 105 V 13 H 102 V 50 C 102 58, 85 68, 50 68 C 25 68, 8 62, 2 54 C 0 51.5, 1 50, 3 50 C 5 50, 10 56, 25 61 C 45 66, 75 64, 98 51 V 13 H 97 Z" fill="currentColor" />
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
