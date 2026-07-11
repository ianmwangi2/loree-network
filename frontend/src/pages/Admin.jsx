import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminPanel } from '../components/AdminPanel';
import { AdminLogin } from '../components/AdminLogin';

export const Admin = () => {
  const { admin } = useAdmin();

  return admin ? <AdminPanel /> : <AdminLogin />;
};

export default Admin;
