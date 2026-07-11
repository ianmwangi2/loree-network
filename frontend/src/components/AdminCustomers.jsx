import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search } from 'lucide-react';

export const AdminCustomers = () => {
  const { users } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    u =>
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="adm-section">
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={15} className="adm-search-ico" />
          <input
            className="adm-search"
            placeholder="Search customers…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="adm-user-cell">
                    <div className="adm-avatar">
                      {user.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.orders}</td>
                <td className="adm-bold">KSh {user.spent.toLocaleString()}</td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString('en-KE', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td>
                  <span
                    className={`adm-badge ${
                      user.status === 'Active' ? 'adm-badge-delivered' : 'adm-badge-cancelled'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminCustomers;
