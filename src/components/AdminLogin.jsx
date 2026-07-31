import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'iammanmeetandgay') {
      onLoginSuccess();
    } else {
      setError('Invalid administrative credentials. Please verify and retry.');
    }
  };

  return (
    <div 
      style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <div 
        className="admin-login-card"
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          border: '1px solid var(--border-color)', 
          boxShadow: 'var(--shadow-md)',
          padding: '3rem 2.5rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="uppercase-track text-gold" style={{ display: 'block', marginBottom: '0.5rem' }}>
            MANMEETGAY STUDIO
          </span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)' }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Access the inventory, order logs, and customer inquiries
          </p>
        </div>

        {error && (
          <div 
            style={{ 
              backgroundColor: '#FFEBEE', 
              color: '#C62828', 
              padding: '0.75rem 1rem', 
              fontSize: '0.75rem', 
              marginBottom: '1.5rem', 
              borderLeft: '3px solid #E53935'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <User size={12} />
              Username
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="admin"
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Lock size={12} />
              Password
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="•••••"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn-premium" 
            style={{ width: '100%' }}
          >
            Authenticate Portal
          </button>
        </form>
      </div>
    </div>
  );
}
