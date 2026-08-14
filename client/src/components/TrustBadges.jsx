// src/components/TrustBadges.jsx
// Social proof bar — used in Home hero and PhonesAccessories page
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShieldCheck, RotateCcw, Truck, Lock, Star } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, title: '100% Genuine', sub: 'Authentic parts only' },
  { icon: RotateCcw, title: '30-Day Return', sub: 'Hassle-free returns' },
  { icon: Truck, title: 'Same-Day Delivery', sub: 'Lagos & Owerri' },
  { icon: Lock, title: 'Secure Checkout', sub: 'Your data is safe' },
  { icon: Star, title: '4.9★ Rating', sub: '500+ happy customers' },
];

const TrustBadges = ({ compact = false }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: compact ? 'repeat(auto-fit, minmax(120px, 1fr))' : 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px'
    }}>
      {badges.map(({ icon: Icon, title, sub }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.07, duration: 0.5 }}
          style={{
            display: 'flex', flexDirection: compact ? 'row' : 'column',
            alignItems: compact ? 'center' : 'flex-start',
            gap: compact ? '10px' : '12px',
            background: '#111', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', padding: compact ? '12px 14px' : '20px',
          }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(229,9,20,0.1)', color: '#E50914',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={18} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'white', fontSize: '13px', margin: 0 }}>{title}</p>
            {!compact && <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '12px', margin: '2px 0 0' }}>{sub}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrustBadges;
