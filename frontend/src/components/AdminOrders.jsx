import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, ChevronDown } from 'lucide-react';

const STATUS_LABELS = {
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

const statusClasses = {
  DELIVERED: 'adm-badge-delivered',
  PROCESSING: 'adm-badge-processing',
  SHIPPED: 'adm-badge-shipped',
  CANCELLED: 'adm-badge-cancelled'
};

const StatusBadge = ({ status }) => (
  <span className={`adm-badge ${statusClasses[status] || ''}`}>{STATUS_LABELS[status] || status}</span>
);

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const orderFilters = ['all', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      order.orderNo.toLowerCase().includes(query) ||
      order.user?.name?.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="adm-section">
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={15} className="adm-search-ico" />
          <input
            className="adm-search"
            placeholder="Search orders…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="adm-filter-tabs">
          {orderFilters.map(filter => (
            <button
              key={filter}
              className={`adm-filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'all' ? 'All' : STATUS_LABELS[filter]}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="adm-mono">{order.orderNo}</td>
                <td>
                  <div className="adm-cust-cell">
                    <span>{order.user?.name}</span>
                    <small>{order.user?.email}</small>
                  </div>
                </td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td>{order.items.reduce((sum, item) => sum + item.qty, 0)}</td>
                <td className="adm-bold">KSh {Number(order.total).toLocaleString()}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>
                  <div className="adm-select-wrap">
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      className="adm-select"
                    >
                      {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(opt => (
                        <option key={opt} value={opt}>
                          {STATUS_LABELS[opt]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="adm-sel-arrow" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminOrders;
