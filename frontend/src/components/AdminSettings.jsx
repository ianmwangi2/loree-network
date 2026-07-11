import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { CircleCheckBig, Save, LogOut } from 'lucide-react';

export const AdminSettings = () => {
  const { adminLogout } = useAdmin();
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    shopName: 'Loree Networks',
    email: 'info@loree.co.ke',
    phone: '+254 700 000 000',
    currency: 'KSh',
    taxRate: '16'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const fields = [
    { label: 'Store Name', key: 'shopName', type: 'text' },
    { label: 'Support Email', key: 'email', type: 'email' },
    { label: 'Phone Number', key: 'phone', type: 'tel' },
    { label: 'Currency Symbol', key: 'currency', type: 'text' },
    { label: 'VAT Rate (%)', key: 'taxRate', type: 'number' }
  ];

  return (
    <div className="adm-section">
      {success && (
        <div className="adm-save-success">
          <CircleCheckBig size={16} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="adm-settings-grid">
        <div className="adm-panel">
          <div className="adm-panel-hd">
            <h3>Store Settings</h3>
          </div>
          <form className="adm-settings-form" onSubmit={handleSubmit}>
            {fields.map(field => (
              <div className="adm-field" key={field.key}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  value={settings[field.key]}
                  onChange={e =>
                    setSettings(prev => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <button type="submit" className="adm-btn-save" style={{ marginTop: 8 }}>
              <Save size={14} /> Save Changes
            </button>
          </form>
        </div>

        <div className="adm-panel">
          <div className="adm-panel-hd">
            <h3>Admin Account</h3>
          </div>
          <div className="adm-settings-info">
            <div className="adm-field">
              <label>Role</label>
              <div className="adm-readonly">Super Admin</div>
            </div>
            <div className="adm-field">
              <label>Email</label>
              <div className="adm-readonly">admin@loree.co.ke</div>
            </div>
          </div>

          <div className="adm-panel-hd" style={{ marginTop: 24 }}>
            <h3>Danger Zone</h3>
          </div>
          <button className="adm-btn-danger" style={{ width: '100%' }} onClick={adminLogout}>
            <LogOut size={15} /> Sign Out of Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;
