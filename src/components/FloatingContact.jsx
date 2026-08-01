import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import './FloatingContact.css';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`floating-contact-container ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Pop-out vertical options */}
      <div className="floating-contact-options">
        
        {/* Instagram Option */}
        <a
          href="https://www.instagram.com/velnoracloths?utm_source=qr&igsh=MTdpN2Nnd3ZzYnl2bA=="
          target="_blank"
          rel="noopener noreferrer"
          className="contact-option-btn instagram"
          title="Follow us on Instagram"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>

        {/* WhatsApp Option */}
        <a
          href="https://wa.me/918619299237?text=Hello%20The%20Velnora%20Sarees,%20I'd%20like%20to%20inquire%20about%20your%20luxury%20collection."
          target="_blank"
          rel="noopener noreferrer"
          className="contact-option-btn whatsapp"
          title="Chat with Us on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.022-5.09-2.885-6.956-1.864-1.863-4.341-2.887-6.97-2.888-5.442 0-9.866 4.415-9.87 9.831-.001 1.721.453 3.4 1.314 4.872l-.99 3.618 3.718-.976zm11.234-6.425c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
        </a>

      </div>

      {/* Small "Contact Us" label just above trigger */}
      <span className="floating-contact-label">Contact Us</span>

      {/* Main trigger button */}
      <button 
        className="floating-contact-trigger" 
        onClick={toggleMenu}
        aria-label="Contact options menu"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
