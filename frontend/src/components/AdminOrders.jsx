import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, ChevronDown } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusClasses = {
    Delivered: 'adm-badge-delivered',
    Processing: 'adm-badge-processing',
    Shipped: 'adm-badge-shipped',
    Cancelled: 'adm-badge-cancelled'
  };
  return <span className={`adm-badge ${statusClasses[status] || ''}`}>{status}</span>;
};

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const orderFilters = ['all', 'Delivered', 'Shipped', 'Processing', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch =
      !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
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
              {filter === 'all' ? 'All' : filter}
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
                <td className="adm-mono">{order.id}</td>
                <td>
                  <div className="adm-cust-cell">
                    <span>{order.customer}</span>
                    <small>{order.email}</small>
                  </div>
                </td>
                <td>
                  {new Date(order.date).toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td>{order.items}</td>
                <td className="adm-bold">KSh {order.total.toLocaleString()}</td>
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
                      {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
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
