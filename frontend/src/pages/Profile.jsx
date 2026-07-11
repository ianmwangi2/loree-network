import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserDashboard } from '../components/UserDashboard';
import { AuthTabs } from '../components/AuthTabs';

export const Profile = () => {
  const { user } = useAuth();

  return user ? <UserDashboard /> : <AuthTabs />;
};

export default Profile;
