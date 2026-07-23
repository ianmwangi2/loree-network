import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminDashboardTabs } from '../data/mockData';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminEnquiries } from './AdminEnquiries';
import { AdminCustomers } from './AdminCustomers';
import { AdminSettings } from './AdminSettings';
import { LogOut } from 'lucide-react';
import { LucideIcon } from './LucideIcon';

export const AdminPanel = () => {
  const { adminLogout, stats } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  const tabComponents = {
    overview: <AdminOverview />,
    products: <AdminProducts />,
    orders: <AdminOrders />,
    enquiries: <AdminEnquiries />,
    customers: <AdminCustomers />,
    settings: <AdminSettings />
  };

  const activeTabConfig = adminDashboardTabs.find(tab => tab.id === activeTab);

  const getSubText = () => {
    switch (activeTab) {
      case 'overview':
        return `KSh ${stats.totalRevenue.toLocaleString()} total revenue • ${stats.totalOrders} orders`;
      case 'products':
        return `${stats.totalProducts} products listed`;
      case 'orders':
        return `${stats.totalOrders} orders • ${stats.pendingOrders} pending`;
      case 'enquiries':
        return `${stats.pendingEnquiries} new enquiries`;
      case 'customers':
        return `${stats.totalUsers} registered customers`;
      case 'settings':
        return 'Manage store configuration';
      default:
        return '';
    }
  };

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <div className="adm-logo-icon">L</div>
          <div>
            <div className="adm-logo-name">Loree Networks</div>
            <div className="adm-logo-sub">Admin Portal</div>
          </div>
        </div>
        <nav className="adm-nav">
          {adminDashboardTabs.map(tab => (
            <button
              key={tab.id}
              className={`adm-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <LucideIcon name={tab.icon} size={18} />
              <span>{tab.label}</span>
              {tab.id === 'orders' && stats.pendingOrders > 0 && (
                <span className="adm-nav-badge">{stats.pendingOrders}</span>
              )}
              {tab.id === 'enquiries' && stats.pendingEnquiries > 0 && (
                <span className="adm-nav-badge">{stats.pendingEnquiries}</span>
              )}
            </button>
          ))}
        </nav>
        <button className="adm-sidebar-logout" onClick={adminLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <div>
            <h2 className="adm-page-title">{activeTabConfig?.label}</h2>
            <p className="adm-page-sub">{getSubText()}</p>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-admin-chip">
              <div className="adm-admin-dot" />
              <span>Admin</span>
            </div>
          </div>
        </div>
        <div className="adm-content">{tabComponents[activeTab]}</div>
      </main>
    </div>
  );
};
export default AdminPanel;
