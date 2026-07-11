import React, { createContext, useContext, useState, useCallback } from 'react';
import { serviceCategories, adminOrdersList, adminCustomersList } from '../data/mockData';

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

const defaultProducts = [
  {
    id: 1,
    name: "TP-Link TL-SF1008P 8-Port PoE Switch",
    sku: "TP-SF1008P",
    category: "surveillance",
    price: 8500,
    inStock: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80",
    description: "8-Port 10/100Mbps Desktop Switch with 4-Port PoE"
  },
  {
    id: 2,
    name: "CAT6 Ethernet Cable 10m",
    sku: "CAT6-10M",
    category: "automation",
    price: 1200,
    inStock: true,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=80&q=80",
    description: "High quality copper CAT6 patch cord 10 meters"
  },
  {
    id: 3,
    name: "Mikrotik RB750Gr3 Router",
    sku: "RB750GR3",
    category: "automation",
    price: 24000,
    inStock: true,
    image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=80&q=80",
    description: "hEX 5-Port Gigabit Ethernet Router with Dual Core 880MHz CPU"
  },
  {
    id: 4,
    name: "Ubiquiti UniFi AP AC LR",
    sku: "UAP-AC-LR",
    category: "automation",
    price: 26000,
    inStock: true,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&q=80",
    description: "802.11ac Long Range Access Point"
  },
  {
    id: 5,
    name: "RJ45 Crimping Tool Kit",
    sku: "RJ45-TOOL",
    category: "automation",
    price: 3500,
    inStock: true,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&q=80",
    description: "All-in-one crimp tool for RJ45, RJ12, RJ11 connectors"
  },
  {
    id: 6,
    name: "Network Cable Tester",
    sku: "NET-TESTER",
    category: "automation",
    price: 15000,
    inStock: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&q=80",
    description: "Professional multi-functional network wire tracker and tester"
  }
];

const ADMIN_EMAIL = 'admin@loree.co.ke';
const ADMIN_PASSWORD = 'Loree@2025';

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('loree_admin') || 'null');
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState(defaultProducts);
  const [orders, setOrders] = useState(adminOrdersList);
  const [users] = useState(adminCustomersList);

  const adminLogin = useCallback((email, password) => {
    if (email.toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error('Invalid admin credentials.');
    }
    const adminSession = { email: ADMIN_EMAIL, name: 'Admin' };
    setAdmin(adminSession);
    localStorage.setItem('loree_admin', JSON.stringify(adminSession));
  }, []);

  const adminLogout = useCallback(() => {
    setAdmin(null);
    localStorage.setItem('loree_admin', 'null');
  }, []);

  const updateProduct = useCallback((id, updatedFields) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    setOrders(prevOrders =>
      prevOrders.map(o => (o.id === id ? { ...o, status } : o))
    );
  }, []);

  // Compute stats on the fly
  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  const stats = {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    totalUsers: users.length,
    totalProducts: products.length
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        adminLogin,
        adminLogout,
        products,
        categories: serviceCategories,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        users,
        stats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
