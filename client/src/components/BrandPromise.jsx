// src/components/BrandPromise.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, Shield, DollarSign, Briefcase, Users, Truck } from 'lucide-react';

const reasons = [
  { icon: Clock, title: 'Fast Service', desc: 'Quick turnaround on repairs and support requests.' },
  { icon: Shield, title: 'Trusted Technicians', desc: 'Experienced professionals you can fully rely on.' },
  { icon: DollarSign, title: 'Affordable Rates', desc: 'Competitive pricing with zero hidden costs.' },
  { icon: Briefcase, title: 'Business Solutions', desc: 'Tailored IT and POS services for any scale.' },
  { icon: Users, title: 'Personal Consultation', desc: 'Expert one-on-one advice to meet your needs.' },
  { icon: Truck, title: 'Nationwide Delivery',       desc: 'We ship across Nigeria — same-day in Lagos & Owerri, next-day nationwide.' },
];

const BrandPromise = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="brand-why" className="w-full" style={{ padding: '96px 0', background: '#0a0a0a' }}>
      <div className="site-container">

        {/* Statement */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '72px' }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: '32px' }}>
            <div className="w-8 h-px bg-accent" />
            <span className="text-accent font-body text-[12px] font-medium tracking-[0.18em] uppercase">Our Promise</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '48px' }}>
            <h2 className="font-display font-bold text-white leading-tight tracking-tight"
              style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Dependable Tech.<br />
              <span className="text-accent">Done Right.</span>
            </h2>
            <p className="font-body text-[#a1a1a6] leading-relaxed" style={{ fontSize: '18px' }}>
              At Spec360, we deliver dependable tech and digital solutions — crafted with care, driven by expertise,
              and designed to work in the real world.
            </p>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-display font-bold text-white"
          style={{ fontSize: '22px', marginBottom: '28px' }}
        >
          Why Choose Us
        </motion.h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '16px' }}>
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.07 }}
                whileHover={{ y: -4 }}
                className="group rounded-xl transition-all duration-300 hover:border-accent/30"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', padding: '28px 24px' }}
              >
                <div className="flex items-center justify-center rounded-xl text-accent mb-5 transition-all duration-300 group-hover:bg-accent group-hover:text-white"
                  style={{ width: '44px', height: '44px', background: 'rgba(229,9,20,0.1)' }}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h4 className="font-display font-semibold text-white tracking-tight" style={{ fontSize: '15px', marginBottom: '8px' }}>{r.title}</h4>
                <p className="font-body text-[#6e6e73]" style={{ fontSize: '13px', lineHeight: '1.65' }}>{r.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;
