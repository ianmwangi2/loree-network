import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, ToggleLeft, ToggleRight, Pen, Trash2, X, Save, Plus, AlertCircle } from 'lucide-react';

const emptyProductForm = {
  name: '',
  sku: '',
  categoryId: '',
  price: '',
  image: '',
  description: ''
};

export const AdminProducts = () => {
  const { products, categories, createProduct, updateProduct, deleteProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState(emptyProductForm);
  const [error, setError] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEditClick = product => {
    setEditingProductId(product.id);
    setEditFormData({
      name: product.name,
      price: Number(product.price),
      description: product.description || ''
    });
  };

  const handleSaveEdit = async () => {
    setError('');
    try {
      await updateProduct(editingProductId, editFormData);
      setEditingProductId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStock = async product => {
    setError('');
    try {
      await updateProduct(product.id, { inStock: !product.inStock });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    setError('');
    try {
      await deleteProduct(deletingProductId);
      setDeletingProductId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    try {
      await createProduct({ ...createFormData, price: Number(createFormData.price) });
      setCreating(false);
      setCreateFormData(emptyProductForm);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="adm-section">
      {error && (
        <div className="auth-error" style={{ marginBottom: 16 }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

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
          <button
            className={`adm-filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
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
        <button className="adm-btn-save" onClick={() => setCreating(true)}>
          <Plus size={14} /> Add Product
        </button>
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
                  <span className="adm-cat-chip">{product.category?.label}</span>
                </td>
                <td className="adm-bold">KSh {Number(product.price).toLocaleString()}</td>
                <td>
                  <button className="adm-toggle" onClick={() => handleToggleStock(product)}>
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
                    <button className="adm-act-btn adm-edit" onClick={() => handleEditClick(product)}>
                      <Pen size={14} />
                    </button>
                    <button className="adm-act-btn adm-del" onClick={() => setDeletingProductId(product.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && (
        <div className="adm-modal-overlay" onClick={() => setCreating(false)}>
          <form className="adm-modal" onClick={e => e.stopPropagation()} onSubmit={handleCreate}>
            <div className="adm-modal-hd">
              <h3>Add Product</h3>
              <button type="button" onClick={() => setCreating(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="adm-field">
              <label>Name</label>
              <input
                required
                value={createFormData.name}
                onChange={e => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="adm-field">
              <label>SKU</label>
              <input
                required
                value={createFormData.sku}
                onChange={e => setCreateFormData(prev => ({ ...prev, sku: e.target.value }))}
              />
            </div>
            <div className="adm-field">
              <label>Category</label>
              <select
                required
                value={createFormData.categoryId}
                onChange={e => setCreateFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-field">
              <label>Price (KSh)</label>
              <input
                required
                type="number"
                min="0"
                value={createFormData.price}
                onChange={e => setCreateFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className="adm-field">
              <label>Image URL</label>
              <input
                required
                value={createFormData.image}
                onChange={e => setCreateFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>
            <div className="adm-field">
              <label>Description</label>
              <input
                required
                value={createFormData.description}
                onChange={e => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="adm-modal-footer">
              <button type="button" className="adm-btn-cancel" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button type="submit" className="adm-btn-save">
                <Save size={14} /> Create
              </button>
            </div>
          </form>
        </div>
      )}

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
              <button className="adm-btn-danger" onClick={handleDelete}>
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
