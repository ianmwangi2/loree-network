import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../lib/apiClient';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('loree_token'));
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async currentToken => {
    const activeToken = currentToken ?? token;
    if (!activeToken) return;
    try {
      const data = await api.get('/orders', activeToken);
      setOrders(data);
    } catch {
      setOrders([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { user: me } = await api.get('/auth/me', token);
        setUser(me);
        await refreshOrders(token);
      } catch {
        localStorage.removeItem('loree_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const persistSession = useCallback((sessionUser, sessionToken) => {
    localStorage.setItem('loree_token', sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
  }, []);

  const signup = useCallback(async (name, email, phone, password) => {
    return api.post('/auth/signup', { name, email, phone, password });
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser, token: newToken } = await api.post('/auth/login', { email, password });
    persistSession(loggedInUser, newToken);
    return loggedInUser;
  }, [persistSession]);

  const verifyEmail = useCallback(async verificationToken => {
    const { user: verifiedUser, token: newToken } = await api.post('/auth/verify-email', { token: verificationToken });
    persistSession(verifiedUser, newToken);
    return verifiedUser;
  }, [persistSession]);

  const resendVerification = useCallback(email => {
    return api.post('/auth/resend-verification', { email });
  }, []);

  const forgotPassword = useCallback(email => {
    return api.post('/auth/forgot-password', { email });
  }, []);

  const resetPassword = useCallback((resetToken, password) => {
    return api.post('/auth/reset-password', { token: resetToken, password });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('loree_token');
    setToken(null);
    setUser(null);
    setOrders([]);
  }, []);

  const updateProfile = useCallback(async profileData => {
    const updatedUser = await api.patch('/users/me', profileData, token);
    setUser(updatedUser);
    return updatedUser;
  }, [token]);

  const changePassword = useCallback((currentPassword, newPassword) => {
    return api.post('/users/me/change-password', { currentPassword, newPassword }, token);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        orders,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        changePassword,
        refreshOrders,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
