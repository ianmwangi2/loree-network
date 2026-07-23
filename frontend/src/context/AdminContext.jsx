import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../lib/apiClient';

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('loree_admin_token'));
  const [admin, setAdmin] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async currentToken => {
    const [productsData, categoriesData, ordersData, usersData, enquiriesData, settingsData] = await Promise.all([
      api.get('/products'),
      api.get('/categories'),
      api.get('/admin/orders', currentToken),
      api.get('/admin/users', currentToken),
      api.get('/admin/contact', currentToken),
      api.get('/admin/settings', currentToken).catch(() => null)
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
    setOrders(ordersData);
    setUsers(usersData);
    setEnquiries(enquiriesData);
    setSettings(settingsData);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { user: me } = await api.get('/auth/me', token);
        if (me.role !== 'ADMIN') throw new Error('Not an admin account');
        setAdmin(me);
        await loadAll(token);
      } catch {
        localStorage.removeItem('loree_admin_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const adminLogin = useCallback(async (email, password) => {
    const { user: loggedInAdmin, token: newToken } = await api.post('/auth/admin/login', { email, password });
    localStorage.setItem('loree_admin_token', newToken);
    setToken(newToken);
    setAdmin(loggedInAdmin);
    await loadAll(newToken);
  }, [loadAll]);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('loree_admin_token');
    setToken(null);
    setAdmin(null);
    setProducts([]);
    setOrders([]);
    setUsers([]);
    setEnquiries([]);
    setSettings(null);
  }, []);

  const createProduct = useCallback(async productData => {
    const created = await api.post('/products', productData, token);
    setProducts(prev => [...prev, created]);
    return created;
  }, [token]);

  const updateProduct = useCallback(async (id, updatedFields) => {
    const updated = await api.patch(`/products/${id}`, updatedFields, token);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    return updated;
  }, [token]);

  const deleteProduct = useCallback(async id => {
    await api.delete(`/products/${id}`, token);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [token]);

  const updateOrderStatus = useCallback(async (id, status) => {
    const updated = await api.patch(`/admin/orders/${id}/status`, { status }, token);
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...updated } : o)));
    return updated;
  }, [token]);

  const updateSettings = useCallback(async settingsData => {
    const updated = await api.patch('/admin/settings', settingsData, token);
    setSettings(updated);
    return updated;
  }, [token]);

  const markEnquiryHandled = useCallback(async (id, handled = true) => {
    const updated = await api.patch(`/admin/contact/${id}`, { handled }, token);
    setEnquiries(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
    return updated;
  }, [token]);

  const replyToEnquiry = useCallback(async (id, replyData) => {
    const reply = await api.post(`/admin/contact/${id}/reply`, replyData, token);
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, handled: true, replies: [...(e.replies || []), reply] } : e))
    );
    return reply;
  }, [token]);

  const activeOrders = orders.filter(o => o.status !== 'CANCELLED');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter(o => o.status === 'PROCESSING').length;
  const pendingEnquiries = enquiries.filter(e => !e.handled).length;

  const stats = {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    totalUsers: users.length,
    totalProducts: products.length,
    pendingEnquiries
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        adminLogin,
        adminLogout,
        products,
        categories,
        createProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        users,
        enquiries,
        markEnquiryHandled,
        replyToEnquiry,
        settings,
        updateSettings,
        stats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
