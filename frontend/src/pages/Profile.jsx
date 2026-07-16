import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserDashboard } from '../components/UserDashboard';
import { AuthTabs } from '../components/AuthTabs';

export const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="profile-page-loading" style={{ padding: '80px 20px', textAlign: 'center' }}>Loading...</div>;
  }

  return user ? <UserDashboard /> : <AuthTabs />;
};

export default Profile;
