import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Mail, Shield, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const { adminLogin } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-wrap">
      <div className="adm-login-card">
        <div className="adm-login-logo">
          <span>L</span>
        </div>
        <h1>Admin Portal</h1>
        <p>Loree Networks – Restricted Access</p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="adm-err">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          <div className="adm-field">
            <label>Email</label>
            <div className="adm-input-wrap">
              <Mail size={15} className="adm-ico" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@loree.co.ke"
                required
              />
            </div>
          </div>
          <div className="adm-field">
            <label>Password</label>
            <div className="adm-input-wrap">
              <Shield size={15} className="adm-ico" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="adm-pw-tog"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <button type="submit" className="adm-login-btn" disabled={loading}>
            {loading ? (
              <span className="adm-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
