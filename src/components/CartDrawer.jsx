import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, onCheckoutSuccess }) {
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  
  // Checkout Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const grandTotal = subtotal + (giftWrap ? 450 : 0);

  const handleQtyChange = (itemId, currentQty, amount, stockLimit) => {
    const newQty = currentQty + amount;
    if (newQty > 0 && newQty <= stockLimit) {
      onUpdateQty(itemId, newQty);
    } else if (newQty > stockLimit) {
      alert(`Only ${stockLimit} units of this design are available in stock.`);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !postal) {
      alert("Please fill in all the details for shipping your handloom saree package.");
      return;
    }

    const generatedId = `MS-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Construct order payload
    const newOrder = {
      id: generatedId,
      customerName: name,
      email,
      phone,
      address: `${address}, ${city} - ${postal}`,
      items: cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      total: grandTotal,
      giftWrap: giftWrap ? 'Yes (Sandalwood Cedar Chest)' : 'No',
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    onCheckoutSuccess(newOrder);
    setOrderId(generatedId);
    setOrderPlaced(true);
    setIsCheckoutMode(false);
    
    // Clear fields
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setPostal('');
    setGiftWrap(false); // Reset wrapping
  };

  const handleClose = () => {
    setIsCheckoutMode(false);
    setOrderPlaced(false);
    setGiftWrap(false);
    onClose();
  };

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            {orderPlaced ? 'In Transit' : isCheckoutMode ? 'Shipping details' : 'Your Collection Bag'}
          </h2>
          <button className="cart-close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Body */}
        {orderPlaced ? (
          /* Order success state */
          <div style={{ flex: 1, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <CheckCircle size={56} className="text-gold" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Order Confirmed</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
              Your order <strong>{orderId}</strong> has been successfully placed. Our master weavers are hand-packaging your signature selection.
            </p>
            <button 
              className="btn-premium"
              onClick={handleClose}
              style={{ width: '100%' }}
            >
              Continue Exploring
            </button>
          </div>
        ) : isCheckoutMode ? (
          /* Simulated Checkout Form */
          <form onSubmit={handlePlaceOrder} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Summary</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>
                  <span>Total Amount Due:</span>
                  <span className="text-gold">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                {giftWrap && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--accent-gold-dark)', marginTop: '0.25rem' }}>
                    Includes Heritage Sandalwood Packaging (+₹450)
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Aarav Sharma" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="aarav@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+91 98765 43210" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Apartment, Street Name, Landmark" 
                  required 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="New Delhi" 
                    required 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pin Code</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="110001" 
                    required 
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="cart-footer">
              <button 
                type="submit"
                className="btn-premium"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Place Simulated Order
                <ArrowRight size={14} />
              </button>
              <button 
                type="button" 
                onClick={() => setIsCheckoutMode(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.75rem', 
                  display: 'block', 
                  margin: '1rem auto 0 auto', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Go back to bag
              </button>
            </div>
          </form>
        ) : cartItems.length === 0 ? (
          /* Empty state */
          <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <ShoppingBag size={48} strokeWidth={1} style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Bag is Empty</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: '1.5', marginBottom: '2rem' }}>
              We invite you to browse our curated collections and choose a legacy weave.
            </p>
            <button 
              className="btn-premium-outline"
              onClick={handleClose}
              style={{ width: '100%' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Normal Cart List state */
          <>
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  
                  <div className="cart-item-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 className="cart-item-name">{item.title}</h4>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                          {item.category}
                        </span>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#C62828'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div className="cart-qty-ctrl">
                        <button 
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => handleQtyChange(item.id, item.quantity, -1, item.stock)}
                        >
                          -
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button 
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => handleQtyChange(item.id, item.quantity, 1, item.stock)}
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              {/* Premium Heritage Box Toggle */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem', 
                  padding: '1rem', 
                  background: 'rgba(197, 168, 128, 0.05)', 
                  border: '1px dashed var(--accent-gold)', 
                  marginBottom: '1.5rem',
                  cursor: 'pointer' 
                }}
                onClick={() => setGiftWrap(!giftWrap)}
              >
                <input 
                  type="checkbox" 
                  checked={giftWrap} 
                  onChange={() => {}} // parent handled
                  style={{ marginTop: '0.15rem', accentColor: 'var(--accent-gold)' }} 
                />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Heritage Sandalwood Packaging (+₹450)</div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: '1.3', marginTop: '0.15rem' }}>
                    Sandalwood-infused custom muslin casing and double-layered red box storage to preserve pure gold zari threads from oxidation.
                  </p>
                </div>
              </div>

              <div className="cart-total-row">
                <span>Subtotal</span>
                <span className="text-gold">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                Handloom taxes and shipping charges calculated at checkout. Every parcel is insured and shipped with luxury custom packaging.
              </p>
              <button 
                className="btn-premium"
                onClick={() => setIsCheckoutMode(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Proceed to Checkout
                <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
