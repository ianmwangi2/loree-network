import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Package, User, CircleCheckBig, Clock, ChevronRight, Shield, Mail, PenLine, Phone, X, Save, AlertCircle, Lock } from 'lucide-react';

const STATUS_LABELS = {
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

const StatusBadge = ({ status }) => {
  let styleClass = '';
  switch (status) {
    case 'DELIVERED':
      styleClass = 'status-delivered';
      break;
    case 'PROCESSING':
      styleClass = 'status-processing';
      break;
    case 'SHIPPED':
      styleClass = 'status-shipped';
      break;
    case 'CANCELLED':
      styleClass = 'status-cancelled';
      break;
    default:
      styleClass = '';
  }
  return <span className={`order-status ${styleClass}`}>{STATUS_LABELS[status] || status}</span>;
};

export const UserDashboard = () => {
  const { user, orders, logout, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSave = async () => {
    setError('');
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Name and phone cannot be empty.');
      return;
    }
    try {
      await updateProfile({ name: formData.name.trim(), phone: formData.phone.trim() });
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;
  const processingCount = orders.filter(o => o.status === 'PROCESSING').length;

  const dashboardTabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={16} /> },
    { id: 'details', label: 'My Details', icon: <User size={16} /> }
  ];

  return (
    <div className="profile-page">
      <div className="profile-hero dashboard-hero">
        <div className="profile-hero-bg" />
        <div className="container profile-hero-content">
          <div className="avatar">
            {user?.name
              ? user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'U'}
          </div>
          <div className="hero-user-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOutIcon size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="container dashboard-container">
        <div className="dash-tabs">
          {dashboardTabs.map(tab => (
            <button
              key={tab.id}
              className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="dash-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orders-icon">
                  <Package size={22} />
                </div>
                <div>
                  <div className="stat-value">{orders.length}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon delivered-icon">
                  <CircleCheckBig size={22} />
                </div>
                <div>
                  <div className="stat-value">{deliveredCount}</div>
                  <div className="stat-label">Delivered</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon spent-icon">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <div className="stat-value">KSh {totalSpent.toLocaleString()}</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon pending-icon">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="stat-value">{processingCount}</div>
                  <div className="stat-label">In Progress</div>
                </div>
              </div>
            </div>

            <div className="section-heading">
              <h3>Recent Orders</h3>
              <button className="view-all-btn" onClick={() => setActiveTab('orders')}>
                View All <ChevronRight size={15} />
              </button>
            </div>

            <div className="orders-list">
              {orders.slice(0, 2).map(order => (
                <div className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div>
                      <div className="order-id">{order.orderNo}</div>
                      <div className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                    <div className="order-total">KSh {Number(order.total).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-heading" style={{ marginTop: 32 }}>
              <h3>Quick Links</h3>
            </div>
            <div className="quick-links">
              <Link to="/services" className="quick-link">
                <Shield size={20} />
                <span>Our Services</span>
              </Link>
              <Link to="/contact" className="quick-link">
                <Mail size={20} />
                <span>Contact Support</span>
              </Link>
              <button className="quick-link" onClick={() => setActiveTab('details')}>
                <PenLine size={20} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dash-section">
            <div className="section-heading">
              <h3>Order History</h3>
              <span className="orders-count">{orders.length} orders</span>
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders">
                <Package size={52} strokeWidth={1.2} />
                <h4>No enquiries yet</h4>
                <p>Contact us about any of our services and your enquiries will appear here.</p>
                <Link to="/services" className="btn-primary">
                  Explore Services
                </Link>
              </div>
            ) : (
              <div className="orders-list full">
                {orders.map(order => (
                  <div key={order.id} className="order-card expandable">
                    <div
                      className="order-card-header clickable"
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    >
                      <div className="order-meta">
                        <div className="order-id">{order.orderNo}</div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-KE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="order-items-count">
                          {order.items.reduce((sum, item) => sum + item.qty, 0)} item(s)
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                      <div className="order-total">KSh {Number(order.total).toLocaleString()}</div>
                      <ChevronRight
                        size={18}
                        className={`order-chevron ${expandedOrderId === order.id ? 'rotated' : ''}`}
                      />
                    </div>
                    {expandedOrderId === order.id && (
                      <div className="order-items">
                        {order.items.map(item => (
                          <div className="order-item" key={item.id}>
                            <img src={item.image} alt={item.nameSnapshot} className="order-item-img" />
                            <div className="order-item-info">
                              <div className="order-item-name">{item.nameSnapshot}</div>
                              <div className="order-item-qty">Qty: {item.qty}</div>
                            </div>
                            <div className="order-item-price">
                              KSh {(Number(item.priceSnapshot) * item.qty).toLocaleString()}
                            </div>
                          </div>
                        ))}
                        <div className="order-items-total">
                          <span>Order Total</span>
                          <strong>KSh {Number(order.total).toLocaleString()}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="dash-section">
            <div className="section-heading">
              <h3>Personal Information</h3>
              {!editMode && (
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditMode(true);
                    setFormData({ name: user.name, phone: user.phone || '' });
                  }}
                >
                  <PenLine size={15} /> <span>Edit</span>
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="save-success">
                <CircleCheckBig size={16} /> <span>Profile updated successfully!</span>
              </div>
            )}

            {editMode ? (
              <div className="edit-form">
                {error && (
                  <div className="auth-error">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrap">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrap">
                      <Phone size={16} className="input-icon" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="edit-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setEditMode(false);
                      setError('');
                    }}
                  >
                    <X size={15} /> <span>Cancel</span>
                  </button>
                  <button className="btn-save" onClick={handleSave}>
                    <Save size={15} /> <span>Save Changes</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-label">
                    <User size={14} /> <span>Full Name</span>
                  </div>
                  <div className="detail-value">{user?.name}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">
                    <Mail size={14} /> <span>Email Address</span>
                  </div>
                  <div className="detail-value">{user?.email}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">
                    <Phone size={14} /> <span>Phone Number</span>
                  </div>
                  <div className="detail-value">{user?.phone || '—'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">
                    <Shield size={14} /> <span>Member Since</span>
                  </div>
                  <div className="detail-value">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-KE', {
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </div>
                </div>
              </div>
            )}

            <div className="section-heading" style={{ marginTop: 40 }}>
              <h3>Account Security</h3>
              {!changingPassword && (
                <button className="edit-btn" onClick={() => setChangingPassword(true)}>
                  <Lock size={15} /> <span>Change Password</span>
                </button>
              )}
            </div>

            {passwordSuccess && (
              <div className="save-success">
                <CircleCheckBig size={16} /> <span>Password updated successfully!</span>
              </div>
            )}

            {changingPassword ? (
              <form className="edit-form" onSubmit={handleChangePassword}>
                {passwordError && (
                  <div className="auth-error">
                    <AlertCircle size={15} />
                    <span>{passwordError}</span>
                  </div>
                )}
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-wrap">
                    <Lock size={16} className="input-icon" />
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-wrap">
                      <Lock size={16} className="input-icon" />
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="input-wrap">
                      <Lock size={16} className="input-icon" />
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>
                <div className="edit-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setChangingPassword(false);
                      setPasswordError('');
                      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
                    }}
                  >
                    <X size={15} /> <span>Cancel</span>
                  </button>
                  <button type="submit" className="btn-save" disabled={savingPassword}>
                    <Save size={15} /> <span>{savingPassword ? 'Saving...' : 'Save Password'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="security-note">
                <Shield size={18} />
                <p>Your password is securely stored and never shared.</p>
              </div>
            )}

            <div className="section-heading" style={{ marginTop: 40 }}>
              <h3>Logout</h3>
            </div>
            <button className="logout-danger" onClick={logout}>
              <LogOutIcon size={16} /> <span>Sign Out of Account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple wrapper for LogOut icon mapping
const LogOutIcon = ({ size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-log-out"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
};
export default UserDashboard;
