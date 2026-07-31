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
      <div className="loader-brand">
        M A N M E E T G A Y
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
