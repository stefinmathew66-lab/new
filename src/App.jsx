import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { defaultProducts } from './data/defaultProducts';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState('storefront'); // 'storefront' or 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Core Data States (linked to localStorage)
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // UI Interactive States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('General Consultation');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    // 1. Load Products
    const storedProducts = localStorage.getItem('manmeetgay_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('manmeetgay_products', JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }

    // 2. Load Cart
    const storedCart = localStorage.getItem('manmeetgay_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // 3. Load Orders
    const storedOrders = localStorage.getItem('manmeetgay_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    // 4. Load Inquiries
    const storedInquiries = localStorage.getItem('manmeetgay_inquiries');
    if (storedInquiries) {
      setInquiries(JSON.parse(storedInquiries));
    }

    // Check if admin is already logged in for this session
    const adminSession = sessionStorage.getItem('manmeetgay_admin_auth');
    if (adminSession === 'true') {
      setIsAdminAuthenticated(true);
    }

    // Check if URL search query contains '?admin' or '?view=admin' or ends with '/admin' to trigger admin workspace view
    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname.endsWith('/admin') || params.has('admin') || window.location.search.includes('view=admin')) {
      setCurrentView('admin');
    }
  }, []);

  // Sync Cart to localStorage when mutated
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('manmeetgay_cart', JSON.stringify(newCart));
  };

  // Intersection Observer for scroll entrance reveals
  useEffect(() => {
    if (isLoaded && currentView === 'storefront') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      const elements = document.querySelectorAll('.reveal');
      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
      };
    }
  }, [isLoaded, currentView, products, selectedCategory]);

  // Cart operations
  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    
    // Check stock limit
    const currentQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    if (currentQty + 1 > product.stock) {
      alert(`Only ${product.stock} units of this masterwork are available. Cannot add more.`);
      return;
    }

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }
    saveCart(newCart);
    setIsCartOpen(true);
    setSelectedProduct(null); // Close quick-view modal if open
  };

  const handleUpdateCartQty = (itemId, newQty) => {
    const newCart = cart.map((item) => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    saveCart(newCart);
  };

  const handleRemoveCartItem = (itemId) => {
    const newCart = cart.filter((item) => item.id !== itemId);
    saveCart(newCart);
  };

  // Checkout process simulation
  const handleCheckoutSuccess = (newOrder) => {
    // 1. Save order
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('manmeetgay_orders', JSON.stringify(updatedOrders));

    // 2. Adjust products stock levels
    const updatedProducts = products.map((prod) => {
      const purchasedItem = newOrder.items.find((item) => item.id === prod.id);
      if (purchasedItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - purchasedItem.quantity)
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    localStorage.setItem('manmeetgay_products', JSON.stringify(updatedProducts));

    // 3. Clear cart
    saveCart([]);
  };

  // Contact Inquiry Submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone || !contactMessage) {
      alert("Please complete the required details before sending.");
      return;
    }

    const newInquiry = {
      id: `INQ-${Date.now()}`,
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      subject: contactSubject,
      message: contactMessage,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedInquiries = [newInquiry, ...inquiries];
    setInquiries(updatedInquiries);
    localStorage.setItem('manmeetgay_inquiries', JSON.stringify(updatedInquiries));

    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
    setContactSubject('General Consultation');

    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  // Admin Dashboard Hooks
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('manmeetgay_admin_auth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('manmeetgay_admin_auth');
    setCurrentView('storefront');
  };

  const handleAdminAddProduct = (newProduct) => {
    const updatedList = [newProduct, ...products];
    setProducts(updatedList);
    localStorage.setItem('manmeetgay_products', JSON.stringify(updatedList));
  };

  const handleAdminEditProduct = (updatedProduct) => {
    const updatedList = products.map((p) => 
      p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
    );
    setProducts(updatedList);
    localStorage.setItem('manmeetgay_products', JSON.stringify(updatedList));
  };

  const handleAdminDeleteProduct = (productId) => {
    const updatedList = products.filter((p) => p.id !== productId);
    setProducts(updatedList);
    localStorage.setItem('manmeetgay_products', JSON.stringify(updatedList));
  };

  const handleAdminUpdateOrderStatus = (orderId, newStatus) => {
    const updatedList = orders.map((o) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedList);
    localStorage.setItem('manmeetgay_orders', JSON.stringify(updatedList));
  };

  const handleAdminDeleteInquiry = (inquiryId) => {
    const updatedList = inquiries.filter((inq) => inq.id !== inquiryId);
    setInquiries(updatedList);
    localStorage.setItem('manmeetgay_inquiries', JSON.stringify(updatedList));
  };

  // Filter products by selected tab
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  // View switches
  const handleExploreClick = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* 1. Global Preloader */}
      <Loader onFinish={() => setIsLoaded(true)} />

      {isLoaded && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header Navbar */}
          <Navbar 
            cartCount={totalCartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onViewChange={setCurrentView}
            currentView={currentView}
          />

          {/* 2. PUBLIC STOREFRONT VIEW */}
          {currentView === 'storefront' && (
            <main style={{ marginTop: 'var(--nav-height)' }}>
              
              {/* Hero Banner Section */}
              <Hero onExploreClick={handleExploreClick} />

              {/* Collections Grid Catalog */}
              <section id="shop" style={{ padding: '8rem 0', backgroundColor: 'var(--bg-primary)' }}>
                <div className="container">
                  <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="uppercase-track text-gold" style={{ display: 'block', marginBottom: '0.75rem' }}>
                      THE SIGNATURE COLLECTION
                    </span>
                    <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
                      Select Handloom Masterpieces
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                      Explore the finest Kanchipurams, Banarasis, and delicate organzas. Woven by hand, certified for purity, and curated for heirloom collections.
                    </p>
                  </div>

                  {/* Filter Categories */}
                  <div className="filter-container reveal">
                    {['All', 'Silk', 'Banarasi', 'Organza', 'Linen', 'Georgette'].map((cat) => (
                      <button
                        key={cat}
                        className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat === 'All' ? 'All Weaves' : `${cat}`}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid */}
                  <div className="saree-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id}
                        product={product}
                        onCardClick={setSelectedProduct}
                        onQuickAdd={handleAddToCart}
                      />
                    ))}
                    {filteredProducts.length === 0 && (
                      <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
                        <Compass size={32} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Weaves Found</h4>
                        <p style={{ fontSize: '0.85rem' }}>We are weaving new designs. Check back shortly.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Heritage Brand Philosophy Section */}
              <section id="heritage" style={{ padding: '8rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container">
                  <div className="contact-layout" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                    <div className="reveal reveal-left">
                      <span className="uppercase-track text-gold" style={{ display: 'block', marginBottom: '0.75rem' }}>
                        OUR HERITAGE & LEGACY
                      </span>
                      <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', lineHeight: '1.15' }}>
                        Woven in Time, <br />
                        Preserving the Loom of India
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                        At <strong>Manmeetgay Sarees</strong>, every thread tells a story of devotion, patience, and ancestral heritage. We partner directly with artisan families in Kanchipuram, Varanasi, and weaving centers across India to bring you authentic handloom designs.
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                        A single Kanchipuram silk saree can take up to 20 days of intricate hand weaving, incorporating three shuttles and authentic silver thread dipped in pure gold zari. These are not merely garments; they are wearable art pieces designed to be passed down through generations.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldCheck size={20} className="text-gold" />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Silk Mark Certified</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Compass size={20} className="text-gold" />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Artisan Partnerships</span>
                        </div>
                      </div>
                    </div>

                    <div className="reveal reveal-right" style={{ display: 'flex', justifyContent: 'center' }}>
                      <div 
                        style={{ 
                          width: '100%', 
                          maxWidth: '400px', 
                          aspectRatio: '3/4', 
                          overflow: 'hidden', 
                          border: '1px solid var(--border-gold)',
                          boxShadow: 'var(--shadow-lg)'
                        }}
                      >
                        <img 
                          src="/images/banarasi_pink.png" 
                          alt="Artisan Saree Weaving" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Consultation Booking & Contact Form */}
              <section id="contact" className="contact-section">
                <div className="container">
                  <div className="contact-layout">
                    
                    <div className="contact-text-area reveal reveal-left">
                      <span className="uppercase-track text-gold" style={{ display: 'block', marginBottom: '0.75rem' }}>
                        BRIDAL & EXCLUSIVE INQUIRIES
                      </span>
                      <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
                        Schedule a Private Fitting
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                        Whether selecting an heirloom saree for your wedding day or commissioning a custom-woven motif, our concierge service is here to assist. Fill out the form or reach out directly.
                      </p>

                      <div className="contact-card-info">
                        <div className="contact-info-block">
                          <MapPin size={18} className="contact-info-icon" />
                          <div>
                            <div className="contact-info-title">Atelier Address</div>
                            <div className="contact-info-desc">7, Chanakyapuri Diplomatic Enclave, New Delhi - 110021</div>
                          </div>
                        </div>

                        <div className="contact-info-block">
                          <Phone size={18} className="contact-info-icon" />
                          <div>
                            <div className="contact-info-title">Telephone</div>
                            <div className="contact-info-desc">+91 11 4987 6543 | +91 99999 88888</div>
                          </div>
                        </div>

                        <div className="contact-info-block">
                          <Mail size={18} className="contact-info-icon" />
                          <div>
                            <div className="contact-info-title">Email Correspondence</div>
                            <div className="contact-info-desc">concierge@manmeetgay.com</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="contact-form-card reveal reveal-right">
                      {contactSuccess ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✨</span>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '1rem' }}>Inquiry Received</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Thank you. Our luxury concierge representative will contact you within 24 hours to schedule your private consultation.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit}>
                          <div className="form-group">
                            <label className="form-label">Your Name *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="Manmeet Singh" 
                              required 
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                              <label className="form-label">Email *</label>
                              <input 
                                type="email" 
                                className="form-input" 
                                placeholder="manmeet@example.com" 
                                required 
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Phone *</label>
                              <input 
                                type="tel" 
                                className="form-input" 
                                placeholder="+91 98765 43210" 
                                required 
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Consultation Purpose</label>
                            <select 
                              className="admin-select"
                              value={contactSubject}
                              onChange={(e) => setContactSubject(e.target.value)}
                            >
                              <option value="General Consultation">General Consultation</option>
                              <option value="Bridal Collection Inquiry">Bridal Trousseau Selection</option>
                              <option value="Custom Motif Weave Order">Custom Motif Weave Order</option>
                              <option value="Corporate Handloom Gifting">Corporate Gifting Inquiry</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">Message Details *</label>
                            <textarea 
                              className="form-input" 
                              rows="4" 
                              placeholder="Please describe your color preferences, wedding dates, or design expectations..." 
                              required
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                            />
                          </div>

                          <button type="submit" className="btn-premium" style={{ width: '100%' }}>
                            Submit Request
                          </button>
                        </form>
                      )}
                    </div>

                  </div>
                </div>
              </section>

              {/* Footer Section */}
              <footer className="footer">
                <div className="container">
                  <div className="footer-grid">
                    <div>
                      <div className="footer-brand">MANMEETGAY</div>
                      <p className="footer-tagline">
                        Preserving the loom of India through curated, certified handloom silk sarees. Masterpieces designed to be passed down.
                      </p>
                    </div>

                    <div>
                      <h4 className="footer-title">Heritage Collections</h4>
                      <ul className="footer-links">
                        <li className="footer-link" onClick={() => { setSelectedCategory('Silk'); handleExploreClick(); }}>Kanchipuram Silks</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('Banarasi'); handleExploreClick(); }}>Banarasi Brocades</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('Organza'); handleExploreClick(); }}>Fine Organza & Tissue</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('Linen'); handleExploreClick(); }}>Minimalist Linens</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="footer-title">Studio Links</h4>
                      <ul className="footer-links">
                        <li className="footer-link" onClick={() => handleExploreClick()}>Online Boutique</li>
                        <li className="footer-link" onClick={() => { const el = document.getElementById('heritage'); el && el.scrollIntoView({ behavior: 'smooth' }); }}>Heritage Page</li>
                        <li className="footer-link" onClick={() => { const el = document.getElementById('contact'); el && el.scrollIntoView({ behavior: 'smooth' }); }}>Book Fitting</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="footer-title">Stay Connected</h4>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Register to receive announcements on new weaver drops and private exhibitions.
                      </p>
                      <div style={{ display: 'flex' }}>
                        <input 
                          type="email" 
                          placeholder="Your email address" 
                          style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.03)',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            color: '#FFFFFF'
                          }} 
                        />
                        <button 
                          className="btn-premium"
                          style={{ padding: '0.75rem 1.25rem', background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: 'var(--text-primary)' }}
                          onClick={() => alert('Thank you for subscribing to Manmeetgay Sarees.')}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="footer-bottom">
                    <span className="footer-copy">
                      © {new Date().getFullYear()} Manmeetgay Sarees Private Limited. All Rights Reserved.
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                      Silk Mark Certified | Authentic Handlooms
                    </span>
                  </div>
                </div>
              </footer>

            </main>
          )}

          {/* 3. ADMINISTRATIVE WORKSPACE VIEW */}
          {currentView === 'admin' && (
            <div style={{ marginTop: 'var(--nav-height)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {!isAdminAuthenticated ? (
                <AdminLogin onLoginSuccess={handleAdminLogin} />
              ) : (
                <AdminDashboard 
                  products={products}
                  orders={orders}
                  inquiries={inquiries}
                  onLogout={handleAdminLogout}
                  onAddProduct={handleAdminAddProduct}
                  onEditProduct={handleAdminEditProduct}
                  onDeleteProduct={handleAdminDeleteProduct}
                  onUpdateOrderStatus={handleAdminUpdateOrderStatus}
                  onDeleteInquiry={handleAdminDeleteInquiry}
                />
              )}
            </div>
          )}

          {/* 4. MODALS & SLIDING DRAWERS */}
          
          {/* Saree Quick View Modal */}
          <ProductDetailModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />

          {/* Shopping Bag Slider Drawer */}
          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onCheckoutSuccess={handleCheckoutSuccess}
          />

        </div>
      )}
    </>
  );
}
