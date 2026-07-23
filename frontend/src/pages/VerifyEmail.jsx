import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CircleCheck, AlertCircle, ArrowRight, MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const attempted = useRef(false);

  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('This verification link is missing its token.');
      return;
    }
    if (attempted.current) return;
    attempted.current = true;

    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(err => {
        setStatus('error');
        setError(err.message);
      });
  }, [token, verifyEmail]);

  return (
    <div className="profile-page">
      <div className="container auth-container">
        <div className="auth-card">
          {status === 'verifying' && (
            <div className="auth-header">
              <div className="auth-icon-wrap">
                <MailCheck size={28} />
              </div>
              <h2>Verifying...</h2>
              <p>Please wait a moment.</p>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="auth-header">
                <div className="auth-icon-wrap">
                  <CircleCheck size={28} />
                </div>
                <h2>Email Verified</h2>
                <p>Your account is active. Welcome to Loree Networks.</p>
              </div>
              <button className="auth-submit" onClick={() => navigate('/profile')}>
                <span>Go to My Account</span>
                <ArrowRight size={16} />
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="auth-header">
                <div className="auth-icon-wrap">
                  <AlertCircle size={28} />
                </div>
                <h2>Verification Failed</h2>
                <p>{error}</p>
              </div>
              <p className="auth-switch">
                <Link to="/profile">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default VerifyEmail;
