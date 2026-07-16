import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { CircleCheckBig, Save, LogOut, AlertCircle } from 'lucide-react';

export const AdminSettings = () => {
  const { admin, adminLogout, settings, updateSettings } = useAdmin();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateSettings({
        shopName: formData.shopName,
        email: formData.email,
        phone: formData.phone,
        currency: formData.currency,
        taxRate: Number(formData.taxRate)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'Store Name', key: 'shopName', type: 'text' },
    { label: 'Support Email', key: 'email', type: 'email' },
    { label: 'Phone Number', key: 'phone', type: 'tel' },
    { label: 'Currency Symbol', key: 'currency', type: 'text' },
    { label: 'VAT Rate (%)', key: 'taxRate', type: 'number' }
  ];

  if (!formData) {
    return <div className="adm-section">Loading settings...</div>;
  }

  return (
    <div className="adm-section">
      {success && (
        <div className="adm-save-success">
          <CircleCheckBig size={16} />
          <span>Settings saved successfully!</span>
        </div>
      )}
      {error && (
        <div className="auth-error" style={{ marginBottom: 16 }}>
          <AlertCircle size={15} />
          <span>{error}</span>
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
                  value={formData[field.key]}
                  onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <button type="submit" className="adm-btn-save" style={{ marginTop: 8 }} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
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
              <div className="adm-readonly">{admin?.email}</div>
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
