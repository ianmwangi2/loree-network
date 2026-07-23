import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CircleCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="profile-page">
        <div className="container auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-wrap">
                <AlertCircle size={28} />
              </div>
              <h2>Invalid Link</h2>
              <p>This password reset link is missing its token. Please request a new one.</p>
            </div>
            <p className="auth-switch">
              <Link to="/forgot-password">Request a new link</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="profile-page">
        <div className="container auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-wrap">
                <CircleCheck size={28} />
              </div>
              <h2>Password Updated</h2>
              <p>Your password has been changed. You can now sign in.</p>
            </div>
            <button className="auth-submit" onClick={() => navigate('/profile')}>
              <span>Go to Sign In</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon-wrap">
              <KeyRound size={28} />
            </div>
            <h2>Set a New Password</h2>
            <p>Choose a new password for your account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="reset-password">New Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reset-confirm">Confirm Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="reset-confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
