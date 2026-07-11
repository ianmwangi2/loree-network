import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, ToggleLeft, ToggleRight, Pen, Trash2, X, Save } from 'lucide-react';

export const AdminProducts = () => {
  const { products, categories, updateProduct, deleteProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deletingProductId, setDeletingProductId] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditFormData({
      name: product.name,
      price: product.price,
      description: product.description || ''
    });
  };

  const handleSaveEdit = () => {
    updateProduct(editingProductId, editFormData);
    setEditingProductId(null);
  };

  return (
    <div className="adm-section">
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={15} className="adm-search-ico" />
          <input
            className="adm-search"
            placeholder="Search products…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="adm-filter-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`adm-filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="adm-prod-cell">
                    <img src={product.image} alt={product.name} className="adm-prod-img" />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="adm-mono">{product.sku}</td>
                <td>
                  <span className="adm-cat-chip">{product.category}</span>
                </td>
                <td className="adm-bold">KSh {product.price.toLocaleString()}</td>
                <td>
                  <button
                    className="adm-toggle"
                    onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                  >
                    {product.inStock ? (
                      <>
                        <ToggleRight size={18} className="adm-on" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={18} className="adm-off" />
                        <span>Out</span>
                      </>
                    )}
                  </button>
                </td>
                <td>
                  <div className="adm-actions">
                    <button
                      className="adm-act-btn adm-edit"
                      onClick={() => handleEditClick(product)}
                    >
                      <Pen size={14} />
                    </button>
                    <button
                      className="adm-act-btn adm-del"
                      onClick={() => setDeletingProductId(product.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProductId && (
        <div className="adm-modal-overlay" onClick={() => setEditingProductId(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-hd">
              <h3>Edit Product</h3>
              <button onClick={() => setEditingProductId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="adm-field">
              <label>Name</label>
              <input
                value={editFormData.name}
                onChange={e => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="adm-field">
              <label>Price (KSh)</label>
              <input
                type="number"
                value={editFormData.price}
                onChange={e => setEditFormData(prev => ({ ...prev, price: +e.target.value }))}
              />
            </div>
            <div className="adm-field">
              <label>Short Description</label>
              <input
                value={editFormData.description}
                onChange={e => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn-cancel" onClick={() => setEditingProductId(null)}>
                Cancel
              </button>
              <button className="adm-btn-save" onClick={handleSaveEdit}>
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingProductId && (
        <div className="adm-modal-overlay" onClick={() => setDeletingProductId(null)}>
          <div className="adm-modal adm-confirm" onClick={e => e.stopPropagation()}>
            <Trash2 size={32} className="adm-confirm-ico" />
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="adm-modal-footer">
              <button className="adm-btn-cancel" onClick={() => setDeletingProductId(null)}>
                Cancel
              </button>
              <button
                className="adm-btn-danger"
                onClick={() => {
                  deleteProduct(deletingProductId);
                  setDeletingProductId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProducts;
