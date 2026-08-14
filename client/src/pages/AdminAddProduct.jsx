// src/pages/AdminAddProduct.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Check, ArrowLeft } from 'lucide-react';
import { createProduct } from '../services/api';

// Keep this in sync with PhonesAccessories filters and the backend Product model
const CATEGORIES = [
  { value: 'phone',     label: 'Phone' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'part',      label: 'Part' },
];

const AdminAddProduct = () => {
  const [form, setForm]       = useState({ name: '', category: 'phone', price: '', description: '', stock: 10, imageFile: null });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef          = useRef(null);
  const navigate              = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) { setForm({ ...form, imageFile: file }); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'imageFile' && v) fd.append('image', v);
      else if (k !== 'imageFile') fd.append(k, v);
    });
    try {
      await createProduct(fd); // JWT auto-attached via API interceptor
      setMessage({ type: 'success', text: 'Product added successfully!' });
      setForm({ name: '', category: 'phone', price: '', description: '', stock: 10, imageFile: null });
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error adding product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#080808]" style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '96px' }}>
      <div className="site-container" style={{ maxWidth: '680px' }}>

        <div style={{ marginBottom: '36px' }}>
          <button
            onClick={() => navigate('/admin/products')}
            className="inline-flex items-center gap-2 font-body text-[#6e6e73] hover:text-white transition-colors"
            style={{ fontSize: '14px', marginBottom: '24px' }}
          >
            <ArrowLeft size={15} strokeWidth={1.5} /> Back to Products
          </button>
          <h1 className="font-display font-bold text-white tracking-tight" style={{ fontSize: '34px' }}>Add Product</h1>
          <p className="font-body text-[#6e6e73]" style={{ fontSize: '14px', marginTop: '6px' }}>
            Fill in the details to add a new product to your store.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Image upload */}
          <div>
            <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '10px' }}>
              Product Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer overflow-hidden transition-all duration-300"
              style={{ border: `2px dashed ${preview ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px' }}
            >
              {preview
                ? <img src={preview} alt="Preview" className="w-full object-cover" style={{ height: '200px' }} />
                : <div className="flex flex-col items-center justify-center gap-3" style={{ padding: '48px 0' }}>
                    <Upload size={24} className="text-[#3a3a3a]" strokeWidth={1.5} />
                    <span className="font-body text-[#6e6e73]" style={{ fontSize: '14px' }}>Click to upload image</span>
                  </div>
              }
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} required className="hidden" />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>
              Product Name
            </label>
            <input
              type="text" name="name" placeholder="e.g. iPhone 15 Pro Max"
              value={form.name} onChange={handleChange} required className="input-field"
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div>
              <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>
                Category
              </label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>
                Price (₦)
              </label>
              <input
                type="number" name="price" placeholder="250000" min="0"
                value={form.price} onChange={handleChange} required className="input-field"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>
              Description
            </label>
            <textarea
              name="description" placeholder="Product details, compatibility, condition..."
              value={form.description} onChange={handleChange} required
              rows="4" className="input-field" style={{ resize: 'none' }}
            />
          </div>

          {/* Stock */}
          <div>
            <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>
              Stock Quantity
            </label>
            <input
              type="number" name="stock" min="0"
              value={form.stock} onChange={handleChange} className="input-field"
            />
            <p className="font-body text-[#6e6e73]" style={{ fontSize: '11px', marginTop: '6px' }}>
              Setting to 0 marks the product as Out of Stock on the storefront.
            </p>
          </div>

          {/* Submit */}
          <div style={{ paddingTop: '8px' }}>
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
              style={{ padding: '16px 32px', fontSize: '16px' }}
            >
              {loading ? 'Adding Product...' : <><Check size={16} /> Add Product</>}
            </button>
            {message.text && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`font-body text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                style={{ fontSize: '14px', marginTop: '16px' }}
              >
                {message.text}
              </motion.p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default AdminAddProduct;
