import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  FileText,
  DollarSign,
  TrendingUp,
  Inbox
} from 'lucide-react';

// Preset of our generated images so the admin can choose them easily for new products!
const AVAILABLE_IMAGES = [
  { name: 'Kanchipuram Red', url: '/images/silk_kanchipuram.png' },
  { name: 'Banarasi Pink', url: '/images/banarasi_pink.png' },
  { name: 'Organza Mint', url: '/images/organza_mint.png' },
  { name: 'Linen Beige', url: '/images/linen_beige.png' },
  { name: 'Georgette Indigo', url: '/images/georgette_indigo.png' }
];

export default function AdminDashboard({ 
  products, 
  orders, 
  inquiries, 
  onLogout, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onUpdateOrderStatus,
  onDeleteInquiry 
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Silk');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [zari, setZari] = useState('');
  const [care, setCare] = useState('');
  const [selectedImage, setSelectedImage] = useState(AVAILABLE_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setCustomImageUrl('');
        setSelectedImage('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Analytics helper calculations
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockCount = products.filter(p => p.stock <= 3).length;

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Silk');
    setPrice('');
    setStock('');
    setDescription('');
    setMaterial('');
    setZari('');
    setCare('');
    setSelectedImage(AVAILABLE_IMAGES[0].url);
    setCustomImageUrl('');
    setUploadedImage('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setDescription(product.description || '');
    setMaterial(product.material || '');
    setZari(product.zari || '');
    setCare(product.care || '');
    
    // Check if image is in our preset
    const isPreset = AVAILABLE_IMAGES.some(img => img.url === product.image);
    if (isPreset) {
      setSelectedImage(product.image);
      setCustomImageUrl('');
    } else {
      setSelectedImage('');
      setCustomImageUrl(product.image);
    }
    setUploadedImage('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!title || !price || !stock) {
      alert("Please fill in the required fields (Title, Price, Stock).");
      return;
    }

    const finalImage = uploadedImage || customImageUrl || selectedImage || AVAILABLE_IMAGES[0].url;

    const productPayload = {
      title,
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      description,
      material,
      zari,
      care,
      image: finalImage,
      detailImage: finalImage,
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`
    };

    if (editingProduct) {
      onEditProduct(productPayload);
    } else {
      onAddProduct(productPayload);
    }

    setIsFormOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to remove this design from the luxury catalog?")) {
      onDeleteProduct(productId);
    }
  };

  return (
    <div className="admin-layout">
      {/* Side Navigation panel */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '0.15em' }}>
            MANMEETGAY
          </span>
        </div>

        <div className="admin-sidebar-menu">
          <button 
            className={`admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          
          <button 
            className={`admin-menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={16} />
            Products ({products.length})
          </button>
          
          <button 
            className={`admin-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <CreditCard size={16} />
            Orders ({orders.length})
          </button>

          <button 
            className={`admin-menu-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <MessageSquare size={16} />
            Inquiries ({inquiries.length})
          </button>
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="admin-menu-item" onClick={onLogout} style={{ color: '#FF8A80' }}>
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content area */}
      <main className="admin-main">
        <header className="admin-navbar">
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
            {activeTab === 'dashboard' && 'Administrative Overview'}
            {activeTab === 'products' && 'Luxury Catalog Management'}
            {activeTab === 'orders' && 'Order Dispatch Logs'}
            {activeTab === 'inquiries' && 'Customer Inquiries & Consultations'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.4rem 0.8rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              System Operator: Admin
            </span>
          </div>
        </header>

        <div className="admin-content">
          
          {/* TAB 1: DASHBOARD STATS OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* Summary Cards Grid */}
              <div className="admin-card-grid">
                <div className="admin-stat-card">
                  <div>
                    <div className="admin-stat-label">Total Revenue</div>
                    <div className="admin-stat-value">₹{totalSales.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="admin-stat-icon">
                    <DollarSign size={22} />
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div>
                    <div className="admin-stat-label">Orders Placed</div>
                    <div className="admin-stat-value">{orders.length}</div>
                  </div>
                  <div className="admin-stat-icon">
                    <TrendingUp size={22} />
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div>
                    <div className="admin-stat-label">Catalog Designs</div>
                    <div className="admin-stat-value">{products.length}</div>
                  </div>
                  <div className="admin-stat-icon">
                    <ShoppingBag size={22} />
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div>
                    <div className="admin-stat-label">Active Inquiries</div>
                    <div className="admin-stat-value">{inquiries.length}</div>
                  </div>
                  <div className="admin-stat-icon">
                    <Inbox size={22} />
                  </div>
                </div>
              </div>

              {/* Low stock notice or minor alerts */}
              {lowStockCount > 0 && (
                <div 
                  style={{ 
                    backgroundColor: '#FFF8E1', 
                    color: '#B78103', 
                    border: '1px solid #FFE082', 
                    padding: '1.25rem 2rem',
                    borderRadius: '4px',
                    marginBottom: '2.5rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong>Inventory Notice:</strong> {lowStockCount} saree design{lowStockCount > 1 ? 's are' : ' is'} running low on stock (3 or fewer items remaining). Please review and restock catalog designs.
                  </div>
                  <button 
                    className="btn-premium"
                    onClick={() => setActiveTab('products')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.65rem', background: '#B78103', borderColor: '#B78103' }}
                  >
                    View Catalog
                  </button>
                </div>
              )}

              {/* Recent Orders table snippet */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Recent Shipments Pending</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td style={{ fontWeight: 600 }}>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>₹{order.total.toLocaleString('en-IN')}</td>
                            <td>
                              <span className={`admin-badge-status status-${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                              No orders placed yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Recent Inquiries</h3>
                  <div 
                    style={{ 
                      background: '#FFFFFF', 
                      border: '1px solid var(--border-color)', 
                      padding: '1.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    {inquiries.slice(0, 3).map(inq => (
                      <div key={inq.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.8rem' }}>{inq.name}</strong>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{inq.date.split(',')[0]}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)', fontWeight: 500, marginBottom: '0.25rem' }}>
                          {inq.subject}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {inq.message}
                        </p>
                      </div>
                    ))}
                    {inquiries.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        No messages received.
                      </div>
                    )}
                    {inquiries.length > 0 && (
                      <button 
                        onClick={() => setActiveTab('inquiries')}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-gold-dark)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem', textDecoration: 'underline' }}
                      >
                        View all consultation requests ({inquiries.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Total Catalog size: <strong>{products.length} designs</strong>
                </span>
                <button className="btn-premium" onClick={handleOpenAddForm} style={{ padding: '0.75rem 1.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={14} />
                  Add New Saree
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Material Details</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            style={{ width: '48px', height: '48px', objectFit: 'cover', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} 
                          />
                        </td>
                        <td style={{ fontWeight: 600 }}>{product.title}</td>
                        <td>
                          <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {product.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>₹{product.price.toLocaleString('en-IN')}</td>
                        <td>
                          <span style={{ color: product.stock === 0 ? '#C62828' : product.stock <= 3 ? '#E65100' : 'inherit', fontWeight: product.stock <= 3 ? 600 : 'normal' }}>
                            {product.stock} units
                          </span>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {product.material ? product.material.split(',')[0] : 'Pure Silk'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.75rem' }}>
                            <button 
                              onClick={() => handleOpenEditForm(product)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                              onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-gold-dark)'}
                              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                              title="Edit Saree Details"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                              onMouseOver={(e) => e.currentTarget.style.color = '#C62828'}
                              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                              title="Remove Saree Design"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER LOGS */}
          {activeTab === 'orders' && (
            <div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date Placed</th>
                      <th>Customer Details</th>
                      <th>Saree Selections</th>
                      <th>Grand Total</th>
                      <th>Shipping Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 700 }}>{order.id}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.date}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{order.email} | {order.phone}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', maxWidth: '220px', marginTop: '0.2rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={order.address}>
                            {order.address}
                          </div>
                        </td>
                        <td>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.75rem', marginBottom: '0.1rem' }}>
                              • {item.title} ({item.category}) × <strong>{item.quantity}</strong>
                            </div>
                          ))}
                          {order.giftWrap && order.giftWrap.startsWith('Yes') && (
                            <div style={{ fontSize: '0.65rem', color: 'var(--accent-gold-dark)', fontWeight: 600, marginTop: '0.25rem' }}>
                              🎁 Sandalwood Wrapping
                            </div>
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>₹{order.total.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`admin-badge-status status-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {order.status !== 'Delivered' && (
                            <select 
                              className="admin-select"
                              style={{ width: '120px', padding: '0.4rem 0.8rem', fontSize: '0.7rem', backgroundPosition: 'right 0.5rem center' }}
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          )}
                          {order.status === 'Delivered' && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Check size={12} className="text-gold" />
                              Dispatched & Delivered
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                          No customer orders recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER INQUIRY LOGS */}
          {activeTab === 'inquiries' && (
            <div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client Name</th>
                      <th>Contact Info</th>
                      <th>Subject / Purpose</th>
                      <th style={{ width: '35%' }}>Message</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => (
                      <tr key={inq.id}>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{inq.date}</td>
                        <td style={{ fontWeight: 600 }}>{inq.name}</td>
                        <td>
                          <div>{inq.email}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{inq.phone}</div>
                        </td>
                        <td style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>{inq.subject}</td>
                        <td style={{ fontSize: '0.75rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>{inq.message}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => onDeleteInquiry(inq.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#C62828'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            title="Delete Log"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                          No consultation messages or custom inquiry entries logged.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Sliding Form Drawer for Add/Edit Sarees */}
      <div className={`admin-panel-slider ${isFormOpen ? 'open' : ''}`}>
        <div className="admin-panel-slider-header">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
            {editingProduct ? 'Modify Saree Specifications' : 'Introduce Saree Design'}
          </h3>
          <button 
            onClick={() => setIsFormOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 70px)' }}>
          <div className="admin-panel-slider-body">
            
            <div className="form-group">
              <label className="form-label">Saree Title *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="E.g., Regal Crimson Temple" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category / Heritage Type</label>
                <select 
                  className="admin-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Silk">Kanchipuram Silk</option>
                  <option value="Banarasi">Banarasi Silk</option>
                  <option value="Organza">Organza & Tissue</option>
                  <option value="Linen">Linen & Cotton</option>
                  <option value="Georgette">Georgette & Chiffon</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹ INR) *</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="24500" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Stock Count *</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="5" 
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Material Details</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="E.g., 100% Pure Mulberry Silk" 
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Zari/Embroidery Details</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="E.g., Pure Gold & Silver Kalabattu threads" 
                value={zari}
                onChange={(e) => setZari(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Care Instructions</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="E.g., Dry Clean Only. Avoid direct sprays." 
                value={care}
                onChange={(e) => setCare(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description & Heritage Summary</label>
              <textarea 
                className="form-input" 
                rows="4" 
                placeholder="Describe the weaving technique, color significance, and aesthetic allure..."
                style={{ resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Premium Saree Image Selector */}
            <div className="form-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
              <label className="form-label">Select Luxury Image Preset</label>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Choose one of our premium high-resolution studio saree photos
              </span>
              
              <div className="admin-img-selector">
                {AVAILABLE_IMAGES.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`img-selector-option ${selectedImage === img.url ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedImage(img.url);
                      setCustomImageUrl('');
                    }}
                    title={img.name}
                  >
                    <img src={img.url} alt={img.name} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem', padding: '1rem', border: '1px dashed var(--border-color)', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>Or Upload Custom Saree Image File</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.75rem', 
                    color: 'var(--text-secondary)',
                    marginTop: '0.25rem',
                    width: '100%',
                    cursor: 'pointer'
                  }} 
                />
                {uploadedImage && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded preview" 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--accent-gold)' }} 
                    />
                    <span style={{ fontSize: '0.65rem', color: '#43A047', fontWeight: 600 }}>✓ Ready to Save</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Or Provide Custom Saree Image URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/... or similar" 
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setSelectedImage('');
                    setUploadedImage('');
                  }}
                />
              </div>
            </div>

          </div>

          <div className="admin-panel-slider-footer">
            <button 
              type="button" 
              className="btn-premium-outline" 
              onClick={() => setIsFormOpen(false)}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-premium"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              {editingProduct ? 'Save Updates' : 'Publish Design'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
