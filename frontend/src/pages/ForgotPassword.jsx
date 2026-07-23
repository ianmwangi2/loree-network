import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, MailCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container auth-container">
        {submitted ? (
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-wrap">
                <MailCheck size={28} />
              </div>
              <h2>Check Your Email</h2>
              <p>
                If an account exists for <strong>{email}</strong>, we've sent a link to reset your password.
              </p>
            </div>
            <p className="auth-switch">
              <Link to="/profile">
                Back to sign in <ArrowRight size={13} />
              </Link>
            </p>
          </div>
        ) : (
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-wrap">
                <KeyRound size={28} />
              </div>
              <h2>Forgot Password</h2>
              <p>Enter your email and we'll send you a link to reset it</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <div className="auth-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="forgot-email">Email Address</label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch">
              <Link to="/profile">Back to sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
