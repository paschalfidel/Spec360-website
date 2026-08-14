// src/components/FeaturedProducts.jsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './products/ProductCard';
import { fetchProducts } from '../services/api';

const MAX_FEATURED = 10;

// Fisher-Yates shuffle — picks random products every page load
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const SAMPLE_PRODUCTS = [
  { _id: 's1', name: 'iPhone 14 Clear Case',        category: 'accessory', price: 8500,  stock: 24,  imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=75', description: 'Crystal-clear slim case. MIL-grade drop protection.' },
  { _id: 's2', name: 'Samsung A54 Screen (OEM)',     category: 'part',      price: 18000, stock: 8,   imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=75', description: 'OEM AMOLED screen. Includes tools & adhesive.' },
  { _id: 's3', name: '20W Fast Charger + Cable',     category: 'accessory', price: 4500,  stock: 50,  imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=75', description: 'Universal USB-C fast charger.' },
  { _id: 's4', name: 'OEM Battery Replacement',      category: 'part',      price: 15000, stock: 3,   imageUrl: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=400&q=75', description: 'Genuine OEM battery. 90-day warranty.' },
  { _id: 's5', name: 'Tempered Glass Guard',         category: 'accessory', price: 3000,  stock: 100, imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=75', description: '9H hardness, anti-fingerprint coating.' },
  { _id: 's6', name: 'iPhone 13 Charging Port',      category: 'part',      price: 12000, stock: 6,   imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=75', description: 'OEM charging port with flex cable.' },
  { _id: 's7', name: 'Samsung Back Glass',           category: 'part',      price: 9500,  stock: 12,  imageUrl: 'https://images.unsplash.com/photo-1546027658-7aa750153465?w=400&q=75', description: 'OEM back glass with adhesive pre-applied.' },
  { _id: 's8', name: 'Wireless Charging Pad',        category: 'accessory', price: 7500,  stock: 30,  imageUrl: 'https://images.unsplash.com/photo-1608751819407-8c8672b65b37?w=400&q=75', description: '15W fast wireless charger for all Qi devices.' },
  { _id: 's9', name: 'Phone Stand & Holder',         category: 'accessory', price: 2500,  stock: 60,  imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=75', description: 'Adjustable desktop phone stand.' },
  { _id: 's10', name: 'Tecno Camon 20 Pro',          category: 'phone',     price: 285000, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=75', description: '108MP camera, 5000mAh battery.' },
];

// Grid CSS: 2 cols mobile → 3 cols at 480px → 4 cols at 768px → 5 cols at 1100px
const GRID_STYLE = `
  .fp-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  @media (min-width: 480px) {
    .fp-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
  }
  @media (min-width: 768px) {
    .fp-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
  }
  @media (min-width: 1100px) {
    .fp-grid { grid-template-columns: repeat(5, 1fr); gap: 18px; }
  }
`;

const FeaturedProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(res => setAllProducts(res.data?.length > 0 ? res.data : SAMPLE_PRODUCTS))
      .catch(()  => setAllProducts(SAMPLE_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  // Pick up to MAX_FEATURED random products — recomputed once when allProducts loads
  const featured = useMemo(
    () => shuffle(allProducts).slice(0, MAX_FEATURED),
    [allProducts]
  );

  const skeletonCount = Math.min(MAX_FEATURED, 10);

  return (
    <section id="featured-products" style={{ background: '#080808', padding: '80px 0' }}>
      <style>{GRID_STYLE}</style>
      <div className="site-container">

        {/* Header */}
        <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '1px', background: '#E50914' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#E50914', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Shop Now
              </span>
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 'clamp(24px, 4vw, 48px)', letterSpacing: '-0.03em', margin: 0 }}>
              Fix or Upgrade Today
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '15px', marginTop: '8px', marginBottom: 0 }}>
              Genuine parts & accessories — from{' '}
              <span style={{ color: '#22c55e', fontWeight: 700 }}>₦3,000</span>
            </p>
          </div>

          <Link
            to="/services/phones-accessories"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#a1a1a6', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = '#a1a1a6'}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="fp-grid">
            {[...Array(skeletonCount)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '0.82', borderRadius: '16px' }} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <ShoppingBag size={40} color="#3a3a3a" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '15px' }}>No products yet.</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#3a3a3a', fontSize: '13px', marginTop: '6px' }}>Add products in the admin panel to see them here.</p>
          </div>
        ) : (
          <div className="fp-grid">
            {featured.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i, 4) * 0.06, duration: 0.45 }}
              >
                <ProductCard product={product} badge={i === 0 ? 'Featured' : undefined} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {!loading && allProducts.length > MAX_FEATURED && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/services/phones-accessories" className="btn-secondary" style={{ fontSize: '14px', padding: '12px 28px' }}>
              See all {allProducts.length} products <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;