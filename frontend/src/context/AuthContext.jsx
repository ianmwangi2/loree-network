import React, { createContext, useContext, useState, useCallback } from 'react';
import { defaultOrdersList } from '../data/mockData';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('loree_session') || 'null');
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState(() => {
    // Initialise with orders from mockData or user orders
    return defaultOrdersList;
  });

  const signup = useCallback((name, email, phone, password) => {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('loree_users') || '[]');
    } catch {
      users = [];
    }

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('loree_users', JSON.stringify(users));

    const { password: _, ...userSession } = newUser;
    setUser(userSession);
    localStorage.setItem('loree_session', JSON.stringify(userSession));
    return userSession;
  }, []);

  const login = useCallback((email, password) => {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('loree_users') || '[]');
    } catch {
      users = [];
    }

    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }

    const { password: _, ...userSession } = foundUser;
    setUser(userSession);
    localStorage.setItem('loree_session', JSON.stringify(userSession));
    return userSession;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.setItem('loree_session', 'null');
  }, []);

  const updateProfile = useCallback((profileData) => {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('loree_users') || '[]');
    } catch {
      users = [];
    }

    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) {
      throw new Error('User not found.');
    }

    users[idx] = { ...users[idx], ...profileData };
    localStorage.setItem('loree_users', JSON.stringify(users));

    const { password: _, ...updatedSession } = users[idx];
    setUser(updatedSession);
    localStorage.setItem('loree_session', JSON.stringify(updatedSession));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, orders, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
