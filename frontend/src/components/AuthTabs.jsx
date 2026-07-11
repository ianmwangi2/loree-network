import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Phone, ShoppingBag, Star, Shield, ArrowRight, ChevronRight, AlertCircle } from 'lucide-react';

const LoginForm = ({ onSwitch }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-icon-wrap">
          <Shield size={28} />
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to your Loree Networks account</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="auth-error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <div className="input-wrap">
            <Mail size={16} className="input-icon" />
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account?{' '}
        <button onClick={onSwitch}>
          Create one <ChevronRight size={13} />
        </button>
      </p>
    </div>
  );
};

const SignupForm = ({ onSwitch }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, phone, password, confirm } = formData;
    if (!name || !email || !phone || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      signup(name, email, phone, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-icon-wrap">
          <User size={28} />
        </div>
        <h2>Create Account</h2>
        <p>Join Loree Networks today</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="auth-error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="signup-name">Full Name <span className="req">*</span></label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                id="signup-name"
                type="text"
                placeholder="John Kamau"
                value={formData.name}
                onChange={handleInputChange('name')}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="signup-phone">Phone <span className="req">*</span></label>
            <div className="input-wrap">
              <Phone size={16} className="input-icon" />
              <input
                id="signup-phone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={formData.phone}
                onChange={handleInputChange('phone')}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">Email Address <span className="req">*</span></label>
          <div className="input-wrap">
            <Mail size={16} className="input-icon" />
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="signup-password">Password <span className="req">*</span></label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleInputChange('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm">Confirm Password <span className="req">*</span></label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="signup-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                value={formData.confirm}
                onChange={handleInputChange('confirm')}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button onClick={onSwitch}>
          Sign in <ChevronRight size={13} />
        </button>
      </p>
    </div>
  );
};

export const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-hero-bg" />
        <div className="container profile-hero-content">
          <ShoppingBag size={40} strokeWidth={1.5} />
          <h1>My Account</h1>
          <p>Access your orders, wishlist and personal details</p>
        </div>
      </div>
      <div className="container auth-container">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>

        {activeTab === 'login' ? (
          <LoginForm onSwitch={() => setActiveTab('signup')} />
        ) : (
          <SignupForm onSwitch={() => setActiveTab('login')} />
        )}

        <div className="auth-perks">
          {[
            {
              icon: <ShoppingBag size={22} />,
              title: 'Order Tracking',
              desc: 'Real-time updates on your purchases'
            },
            {
              icon: <Star size={22} />,
              title: 'Exclusive Deals',
              desc: 'Member-only offers and discounts'
            },
            {
              icon: <Shield size={22} />,
              title: 'Secure Shopping',
              desc: 'Your data is always protected'
            }
          ].map((perk, idx) => (
            <div className="auth-perk" key={idx}>
              <div className="auth-perk-icon">{perk.icon}</div>
              <div>
                <h4>{perk.title}</h4>
                <p>{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AuthTabs;
