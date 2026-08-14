// src/components/Testimonials.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Chidi Okafor',
    location: 'Owerri',
    rating: 5,
    text: "Got my iPhone 14 screen replaced in under 2 hours. Couldn't tell it was ever cracked. Legit shop, no shakara.",
    product: 'iPhone Screen Repair',
    avatar: 'CO',
  },
  {
    name: 'Amaka Eze',
    location: 'Port Harcourt',
    rating: 5,
    text: "Bought a Samsung A54 screen guard and a 20W charger. Quality is top-notch, fast delivery to PH. Will buy again!",
    product: 'Samsung Accessories',
    avatar: 'AE',
  },
  {
    name: 'Tunde Adeyemi',
    location: 'Lagos',
    rating: 5,
    text: "Best prices for genuine iPhone cases in Nigeria. Got same-day delivery in Lagos. 100% recommend Spec360.",
    product: 'iPhone 14 Clear Case',
    avatar: 'TA',
  },
  {
    name: 'Ngozi Ihejirika',
    location: 'Owerri',
    rating: 5,
    text: "Fixed my Samsung battery in one day. They use original parts and the price was fair. My go-to tech shop.",
    product: 'Battery Replacement',
    avatar: 'NI',
  },
];

const Stars = ({ count }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={13} fill={i < count ? '#f59e0b' : 'none'} color={i < count ? '#f59e0b' : '#3a3a3a'} />
    ))}
  </div>
);

const Testimonials = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="testimonials" style={{ background: '#080808', padding: '96px 0' }}>
      <div className="site-container">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '1px', background: '#E50914' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#E50914', fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Reviews
            </span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: 'clamp(32px, 4vw, 54px)', letterSpacing: '-0.03em', margin: 0 }}>
            What Nigerians Are Saying
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '17px', marginTop: '12px' }}>
            Real customers. Real results. Real Naira saved.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '16px'
              }}
            >
              <Stars count={r.rating} />
              <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#a1a1a6', fontSize: '15px', lineHeight: 1.6, margin: 0, flex: 1 }}>
                "{r.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'rgba(229,9,20,0.15)', color: '#E50914',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', flexShrink: 0
                }}>
                  {r.avatar}
                </div>
                <div>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'white', fontSize: '14px', margin: 0 }}>{r.name}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '12px', margin: 0 }}>{r.location} · {r.product}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
