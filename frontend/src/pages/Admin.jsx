import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminPanel } from '../components/AdminPanel';
import { AdminLogin } from '../components/AdminLogin';

export const Admin = () => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading...</div>;
  }

  return admin ? <AdminPanel /> : <AdminLogin />;
};

export default Admin;
