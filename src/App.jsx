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
import PromoPopup from './components/PromoPopup';

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
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [atmosphere, setAtmosphere] = useState('ivory'); // 'ivory' or 'midnight'
  const [showcaseSlideIndices, setShowcaseSlideIndices] = useState({
    Summer: 0,
    Sarees: 0,
    Suits: 0,
    'Co-ords': 0
  });

  // Promotional Popup States
  const [showPromo, setShowPromo] = useState(false);
  const [promoProduct, setPromoProduct] = useState(null);

  // Trigger Promotional Popup 3 seconds after loading
  useEffect(() => {
    if (isLoaded && currentView === 'storefront') {
      const shownThisSession = sessionStorage.getItem('velnora_promo_shown');
      if (!shownThisSession) {
        const timer = setTimeout(() => {
          const target = products.find(p => p.id === 'prod-1') || products[0];
          if (target) {
            setPromoProduct(target);
            setShowPromo(true);
            sessionStorage.setItem('velnora_promo_shown', 'true');
          }
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaded, currentView, products]);

  const handleClaimPromo = (product) => {
    setShowPromo(false);
    // Apply 15% discount for this specific purchase/detail session
    const promotionalProduct = {
      ...product,
      isPromo: true,
      price: Math.round(product.price * 0.85) // 15% discount
    };
    setSelectedProduct(promotionalProduct);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setShowcaseSlideIndices((prev) => ({
        Summer: (prev.Summer + 1) % 2,
        Sarees: (prev.Sarees + 1) % 6,
        Suits: (prev.Suits + 1) % 2,
        'Co-ords': (prev['Co-ords'] + 1) % 2
      }));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (atmosphere === 'midnight') {
      document.body.classList.add('theme-midnight');
    } else {
      document.body.classList.remove('theme-midnight');
    }
  }, [atmosphere]);

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
    const storedProducts = localStorage.getItem('velnora_products');
    let parsedProducts = storedProducts ? JSON.parse(storedProducts) : [];
    
    // Check if the cache contains the old categories (e.g. Silk, Banarasi) instead of Sarees/Summer
    const hasOldCategories = parsedProducts.length > 0 && parsedProducts.some(p => p.category === 'Silk' || p.category === 'Banarasi');
    
    if (!storedProducts || hasOldCategories) {
      localStorage.setItem('velnora_products', JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    } else {
      setProducts(parsedProducts);
    }

    // 2. Load Cart
    const storedCart = localStorage.getItem('velnora_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // 3. Load Orders
    const storedOrders = localStorage.getItem('velnora_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    // 4. Load Inquiries
    const storedInquiries = localStorage.getItem('velnora_inquiries');
    if (storedInquiries) {
      setInquiries(JSON.parse(storedInquiries));
    }

    // Check if admin is already logged in for this session
    const adminSession = sessionStorage.getItem('velnora_admin_auth');
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
    localStorage.setItem('velnora_cart', JSON.stringify(newCart));
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
      // If the incoming product is a promotional product, make sure the cart item adopts the promo price.
      if (product.isPromo) {
        newCart[existingIndex].price = product.price;
        newCart[existingIndex].isPromo = true;
      }
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
    localStorage.setItem('velnora_orders', JSON.stringify(updatedOrders));

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
    localStorage.setItem('velnora_products', JSON.stringify(updatedProducts));

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
    localStorage.setItem('velnora_inquiries', JSON.stringify(updatedInquiries));

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
    sessionStorage.setItem('velnora_admin_auth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('velnora_admin_auth');
    setCurrentView('storefront');
  };

  const handleAdminAddProduct = (newProduct) => {
    const updatedList = [newProduct, ...products];
    setProducts(updatedList);
    localStorage.setItem('velnora_products', JSON.stringify(updatedList));
  };

  const handleAdminEditProduct = (updatedProduct) => {
    const updatedList = products.map((p) => 
      p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
    );
    setProducts(updatedList);
    localStorage.setItem('velnora_products', JSON.stringify(updatedList));
  };

  const handleAdminDeleteProduct = (productId) => {
    const updatedList = products.filter((p) => p.id !== productId);
    setProducts(updatedList);
    localStorage.setItem('velnora_products', JSON.stringify(updatedList));
  };

  const handleAdminUpdateOrderStatus = (orderId, newStatus) => {
    const updatedList = orders.map((o) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedList);
    localStorage.setItem('velnora_orders', JSON.stringify(updatedList));
  };

  const handleAdminDeleteInquiry = (inquiryId) => {
    const updatedList = inquiries.filter((inq) => inq.id !== inquiryId);
    setInquiries(updatedList);
    localStorage.setItem('velnora_inquiries', JSON.stringify(updatedList));
  };

  // Filter products by selected tab
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSubCategory = selectedCategory.toLowerCase() !== 'sarees' || selectedSubCategory === 'All' || (p.subcategory && p.subcategory.toLowerCase() === selectedSubCategory.toLowerCase());
    return matchesCategory && matchesSubCategory;
  });

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
            onViewChange={(view) => {
              setCurrentView(view);
              if (view === 'storefront') {
                setSelectedCategory('All');
                setSelectedSubCategory('All');
              }
            }}
            currentView={currentView}
            atmosphere={atmosphere}
            onAtmosphereToggle={() => setAtmosphere(atmosphere === 'ivory' ? 'midnight' : 'ivory')}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubCategory('All');
            }}
          />

          {/* 2. PUBLIC STOREFRONT VIEW */}
          {currentView === 'storefront' && (
            <main style={{ marginTop: 'var(--nav-height)' }}>
              
              {selectedCategory === 'All' ? (
                /* HOMEPAGE VIEW */
                <>
                  {/* Category Circles Row */}
                  <div className="category-circles-container">
                    <div className="container">
                      <div className="category-circles-grid">
                        {[
                          { name: 'Summer', label: 'Summer Collection', img: '/images/summer_dress.png' },
                          { name: 'Sarees', label: 'Heritage Sarees', img: '/images/silk_kanchipuram.png' },
                          { name: 'Suits', label: 'Ethnic Suits', img: '/images/suit_anarkali.png' },
                          { name: 'Co-ords', label: 'Co-ord Sets', img: '/images/coord_set.png' },
                        ].map((cat) => (
                          <div 
                            key={cat.name} 
                            className={`category-circle-card ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setSelectedSubCategory('All');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <div className="circle-image-frame">
                              <img src={cat.img} alt={cat.label} />
                            </div>
                            <span className="circle-label">{cat.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hero Banner Section */}
                  <Hero onExploreClick={() => { setSelectedCategory('Sarees'); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

                  {/* Ticker / Marquee Banner */}
                  <div className="ticker-marquee-bar">
                    <div className="ticker-marquee-content">
                      {[1, 2, 3].map((i) => (
                        <span key={i} className="ticker-segment">
                          <span>✦ THE VELNORA LUXURY</span>
                          <span className="bullet">✦</span>
                          <span>100% CERTIFIED SILK MARK</span>
                          <span className="bullet">✦</span>
                          <span>DIRECT FROM ARTISAN WEAVERS</span>
                          <span className="bullet">✦</span>
                          <span>WORLDWIDE EXPRESS DELIVERY</span>
                          <span className="bullet">✦</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category Banners Showcase (Examples of each category on main page) */}
                  <section style={{ padding: '8rem 0', backgroundColor: 'var(--bg-primary)' }}>
                    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                      
                      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <span className="uppercase-track text-gold" style={{ display: 'block', marginBottom: '0.75rem' }}>THE SIGNATURE COLLECTIONS</span>
                        <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)' }}>Curated Designer Editions</h2>
                      </div>

                      {[
                        {
                          id: 'Summer',
                          title: 'Summer Collection',
                          subtitle: 'Effortless Minimalist Silhouettes',
                          desc: 'Breezy organic linens, sand tones, and lightweight slip dresses styled for warm days and effortless resort luxury.',
                          images: ['/images/summer_dress.png', '/images/summer_dress_detail.png'],
                          action: 'EXPLORE SUMMER'
                        },
                        {
                          id: 'Sarees',
                          title: 'Heritage Sarees',
                          subtitle: 'Artisanal Handlooms & Pure Zari',
                          desc: 'Masterpieces woven in pure Kanchipuram and Banarasi silk, certified for purity, and detailed with metallic gold work.',
                          images: [
                            '/images/silk_kanchipuram.png', 
                            '/images/silk_kanchipuram_detail.png', 
                            '/images/banarasi_pink.png', 
                            '/images/banarasi_pink_detail.png',
                            '/images/organza_mint.png',
                            '/images/organza_mint_detail.png'
                          ],
                          action: 'EXPLORE SAREES'
                        },
                        {
                          id: 'Suits',
                          title: 'Luxury Suits',
                          subtitle: 'Ornate Traditional Suit Sets',
                          desc: 'Gilded embroidery, pure mulberry silks, and sheer organza dupatta sets curated for luxury and traditional style.',
                          images: ['/images/suit_anarkali.png', '/images/suit_anarkali_detail.png'],
                          action: 'EXPLORE SUITS'
                        },
                        {
                          id: 'Co-ords',
                          title: 'Printed Co-ord Sets',
                          subtitle: 'Modern Silk Crepe Coordinates',
                          desc: 'Contemporary matching sets featuring relaxed-fit camp collar shirts and wide-leg trousers in flowing premium silk.',
                          images: ['/images/coord_set.png', '/images/coord_set_detail.png'],
                          action: 'EXPLORE CO-ORDS'
                        }
                      ].map((sec, idx) => (
                        <div 
                          key={sec.id}
                          className="category-showcase-row"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '4rem',
                            alignItems: 'center'
                          }}
                        >
                          {/* Image side */}
                          <div 
                            className="showcase-image-wrapper"
                            style={{ order: idx % 2 === 0 ? 0 : 1 }}
                          >
                            <div 
                              className="showcase-image-container"
                              onClick={() => { setSelectedCategory(sec.id); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              style={{
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                aspectRatio: '1/1',
                                maxHeight: '520px'
                              }}
                            >
                              {sec.images.map((imgUrl, iIndex) => (
                                <img 
                                  key={imgUrl}
                                  src={imgUrl} 
                                  alt={sec.title} 
                                  style={{ 
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    opacity: showcaseSlideIndices[sec.id] === iIndex ? 1 : 0,
                                    transition: 'opacity 1.2s ease-in-out',
                                    zIndex: showcaseSlideIndices[sec.id] === iIndex ? 2 : 1,
                                    transform: 'scale(1.01)'
                                  }} 
                                />
                              ))}
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                transition: 'background-color 0.4s ease',
                                zIndex: 3
                              }} className="showcase-img-overlay" />
                            </div>
                          </div>

                          {/* Text side */}
                          <div style={{ textAlign: idx % 2 === 0 ? 'left' : 'right' }}>
                            <span className="uppercase-track text-gold" style={{ fontSize: '0.7rem' }}>{sec.subtitle}</span>
                            <h3 
                              onClick={() => { setSelectedCategory(sec.id); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}
                            >
                              {sec.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '480px', marginLeft: idx % 2 === 0 ? '0' : 'auto' }}>
                              {sec.desc}
                            </p>
                            <button 
                              className="btn-premium" 
                              onClick={() => { setSelectedCategory(sec.id); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            >
                              {sec.action}
                            </button>
                          </div>

                        </div>
                      ))}

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
                            At <strong>The Velnora Sarees</strong>, every thread tells a story of devotion, patience, and ancestral heritage. We partner directly with artisan families in Kanchipuram, Varanasi, and weaving centers across India to bring you authentic handloom designs.
                          </p>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            Our mission is to sustain high-density zari craftsmanship, pure mulberry weaves, and ethical production practices. Every creation purchased directly funds the weavers, keeping their loom active and preserving traditional Indian artistry.
                          </p>
                        </div>
                        <div className="reveal reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                          <div style={{ padding: '2rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                            <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-dark)', marginBottom: '0.5rem' }}>100% Certified Purity</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Every saree comes with official Silk Mark certification, guaranteeing authentic mulberry silk and real silver/gold thread zari weaving.</p>
                          </div>
                          <div style={{ padding: '2rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                            <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-dark)', marginBottom: '0.5rem' }}>Ethical Artisanship</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>We eliminate middlemen, paying direct fair wages to weaver clusters and investing 5% of all proceeds in loom preservation funds.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Contact / Consultation Booking Section */}
                  <section id="contact" style={{ padding: '8rem 0', backgroundColor: 'var(--bg-primary)' }}>
                    <div className="container">
                      <div className="contact-layout">
                        
                        <div className="reveal reveal-left">
                          <span className="uppercase-track text-gold" style={{ display: 'block', marginBottom: '0.75rem' }}>
                            VISIT OUR STUDIO
                          </span>
                          <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', lineHeight: '1.15' }}>
                            Book a Private <br />
                            Fitting Consultation
                          </h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                            Experience our collection in a private setting. Let our design consultants guide you through the weaves, history, and styling of our heritage sarees, bridal trousseaus, and customized commissions.
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                              <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-dark)', marginBottom: '0.25rem' }}>Flagship Atelier</h5>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bypass Road, Dungarpur, Rajasthan</p>
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-dark)', marginBottom: '0.25rem' }}>Hours of Experience</h5>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tuesday – Sunday: 11:00 AM – 7:00 PM (By Appointment Only)</p>
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-dark)', marginBottom: '0.25rem' }}>Direct Line</h5>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>concierge@thevelnora.com | +91 86192 99237</p>
                            </div>
                          </div>
                        </div>

                        <div className="reveal reveal-right contact-form-card" style={{ padding: '3rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                          <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', marginBottom: '2rem' }}>Request Appointment</h3>
                          {contactSuccess ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold-dark)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Appointment Requested</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Our concierge will reach out to you within 24 hours to confirm your reservation details.</p>
                            </div>
                          ) : (
                            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  placeholder="Aarav Sharma" 
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
                                    placeholder="aarav@example.com" 
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
                </>
              ) : (
                /* DEDICATED CATEGORY PAGE */
                <section style={{ minHeight: '80vh', backgroundColor: 'var(--bg-primary)', paddingBottom: '8rem' }}>
                  
                  {/* Category Banner Header */}
                  <div 
                    style={{
                      background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(' + (
                        selectedCategory === 'Summer' ? '/images/summer_dress.png' :
                        selectedCategory === 'Sarees' ? '/images/silk_kanchipuram.png' :
                        selectedCategory === 'Suits' ? '/images/suit_anarkali.png' : '/images/coord_set.png'
                      ) + ')',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '350px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      borderBottom: '1px solid var(--border-color)',
                      padding: '0 2rem'
                    }}
                  >
                    <span 
                      onClick={() => { setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-gold)', display: 'block', marginBottom: '1rem', fontWeight: 600 }}
                    >
                      ← Back to Homepage
                    </span>
                    <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {selectedCategory}
                    </h1>
                    <p style={{ fontSize: '0.9rem', opacity: '0.85', letterSpacing: '0.05em', marginTop: '0.5rem', maxWidth: '500px' }}>
                      {selectedCategory === 'Summer' && 'Lightweight organic linen apparel and minimal slip dresses styled for warm days.'}
                      {selectedCategory === 'Sarees' && 'Pure mulberry silks, certified gold and silver zari, handloom Kanchipurams and Banarasis.'}
                      {selectedCategory === 'Suits' && 'Luxury silk salwar suits and gold thread embroidered dupatta sets.'}
                      {selectedCategory === 'Co-ords' && 'Relaxed-fit luxury printed camp shirts and wide-leg trousers in crepe silk.'}
                    </p>
                  </div>

                  <div className="container" style={{ marginTop: '5rem' }}>
                    
                    {/* Subcategories (Sarees only) */}
                    {selectedCategory.toLowerCase() === 'sarees' && (
                      <div className="reveal" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '4rem' }}>
                        {['All', 'Silk', 'Banarasi', 'Organza', 'Linen', 'Georgette'].map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubCategory(sub)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: selectedSubCategory === sub ? 'var(--accent-gold-dark)' : 'var(--text-secondary)',
                              borderBottom: selectedSubCategory === sub ? '2px solid var(--accent-gold-dark)' : '2px solid transparent',
                              paddingBottom: '0.25rem',
                              fontFamily: 'var(--font-sans)',
                              fontWeight: 600,
                              transition: 'var(--transition-fast)'
                            }}
                          >
                            {sub === 'All' ? 'All Saree Types' : sub}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Product Cards Grid */}
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
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Items Found</h4>
                          <p style={{ fontSize: '0.85rem' }}>We are weaving new designs. Check back shortly.</p>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
                      <button className="btn-premium reset-view-btn" onClick={() => { setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        ← BACK TO HOMEPAGE
                      </button>
                    </div>

                  </div>
                </section>
              )}

              {/* Footer Section */}
              <footer className="footer">
                <div className="container">
                  <div className="footer-grid">
                    <div>
                      <div className="footer-brand">THE VELNORA</div>
                      <p className="footer-tagline">
                        Preserving the loom of India through curated, certified handloom silk sarees. Masterpieces designed to be passed down.
                      </p>
                    </div>

                    <div>
                      <h4 className="footer-title">Heritage Collections</h4>
                      <ul className="footer-links">
                        <li className="footer-link" onClick={() => { setSelectedCategory('Summer'); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Summer Collection</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('Sarees'); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Heritage Sarees</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('Suits'); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Luxury Suits</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('Co-ords'); setSelectedSubCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Modern Co-ords</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="footer-title">Studio Links</h4>
                      <ul className="footer-links">
                        <li className="footer-link" onClick={() => { setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Online Boutique</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('All'); setTimeout(() => { const el = document.getElementById('heritage'); el && el.scrollIntoView({ behavior: 'smooth' }); }, 150); }}>Heritage Page</li>
                        <li className="footer-link" onClick={() => { setSelectedCategory('All'); setTimeout(() => { const el = document.getElementById('contact'); el && el.scrollIntoView({ behavior: 'smooth' }); }, 150); }}>Book Fitting</li>
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
                          onClick={() => alert('Thank you for subscribing to The Velnora Sarees.')}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="footer-bottom">
                    <span className="footer-copy">
                      © {new Date().getFullYear()} The Velnora Sarees Private Limited. All Rights Reserved.
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

          {/* Promotional Special Offer Popup */}
          <PromoPopup 
            isOpen={showPromo} 
            onClose={() => setShowPromo(false)} 
            product={promoProduct} 
            onClaim={handleClaimPromo} 
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

          {/* Floating WhatsApp Option */}
          {currentView === 'storefront' && (
            <a
              href="https://wa.me/918619299237?text=Hello%20The%20Velnora%20Sarees,%20I'd%20like%20to%20inquire%20about%20your%20luxury%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-float-btn"
              title="Chat with Us on WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.022-5.09-2.885-6.956-1.864-1.863-4.341-2.887-6.97-2.888-5.442 0-9.866 4.415-9.87 9.831-.001 1.721.453 3.4 1.314 4.872l-.99 3.618 3.718-.976zm11.234-6.425c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </a>
          )}

        </div>
      )}
    </>
  );
}
