// src/components/BundleBanner.jsx
// "Case + Charger Bundle" deal component — place inside Home or PhonesAccessories
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const bundles = [
  {
    name: 'Starter Bundle',
    items: 'Clear Case + 20W Charger',
    original: 13000,
    bundle: 11000,
    saving: 2000,
    badge: 'Most Popular',
    badgeColor: '#E50914',
    href: '/services/phones-accessories',
  },
  {
    name: 'Screen Protection Pack',
    items: 'Screen Guard × 2 + Case',
    original: 19500,
    bundle: 16000,
    saving: 3500,
    badge: 'Best Value',
    badgeColor: '#f59e0b',
    href: '/services/phones-accessories',
  },
];

const BundleBanner = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section style={{ background: '#080808', padding: '0 0 96px' }}>
      <div className="site-container">

        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '1px', background: '#E50914' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#E50914', fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Bundle Deals
            </span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 'clamp(28px, 3.5vw, 48px)', letterSpacing: '-0.03em', margin: 0 }}>
            Save More, Buy Together
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {bundles.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{
                background: 'linear-gradient(135deg, #141414 0%, #1a1a1a 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px', padding: '28px',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {/* Accent glow */}
              <div style={{
                position: 'absolute', top: '-40px', right: '-40px',
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'rgba(229,9,20,0.08)', filter: 'blur(30px)',
                pointerEvents: 'none'
              }} />

              {/* Badge */}
              <span style={{
                display: 'inline-block', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700,
                background: b.badgeColor, color: 'white',
                padding: '4px 12px', borderRadius: '100px', marginBottom: '18px'
              }}>
                {b.badge}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Package size={18} color="#E50914" strokeWidth={1.5} />
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'white', fontSize: '20px', margin: 0 }}>
                  {b.name}
                </h3>
              </div>

              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '14px', marginBottom: '20px' }}>
                {b.items}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px', color: '#22c55e', letterSpacing: '-0.02em' }}>
                  ₦{b.bundle.toLocaleString()}
                </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#3a3a3a', fontSize: '16px', textDecoration: 'line-through' }}>
                  ₦{b.original.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                <Zap size={13} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>
                  Save ₦{b.saving.toLocaleString()}
                </span>
              </div>

              <Link
                to={b.href}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px',
                  color: 'white', background: '#E50914', borderRadius: '100px',
                  padding: '12px 22px', textDecoration: 'none', transition: 'opacity 0.2s'
                }}
              >
                Get Bundle <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BundleBanner;
