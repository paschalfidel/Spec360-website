// src/components/ServicePageLayout.jsx
// padding-top: 96px = 64px navbar clearance + 32px breathing room
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight } from 'lucide-react';

const ServicePageLayout = ({ eyebrow, title, titleAccent, subtitle, features, ctaLabel = 'Get in Touch', ctaHref = 'tel:08182799154', footerNote }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section className="w-full bg-[#080808]" style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '96px' }}>
      <div className="site-container">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '56px' }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div className="w-8 h-px bg-accent" />
            <span className="text-accent font-body text-[12px] font-medium tracking-[0.18em] uppercase">{eyebrow}</span>
          </div>
          <h1 className="font-display font-bold text-white tracking-tight" style={{ fontSize: 'clamp(36px, 5vw, 68px)', marginBottom: '20px' }}>
            {title}{' '}{titleAccent && <span className="text-accent">{titleAccent}</span>}
          </h1>
          <p className="font-body text-[#a1a1a6] leading-relaxed" style={{ fontSize: '18px', maxWidth: '560px' }}>{subtitle}</p>
        </motion.div>

        {/* Features grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '20px' }}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl transition-all duration-300 hover:border-white/[0.14]"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', padding: '32px' }}
              >
                <div className="flex items-center justify-center rounded-xl text-accent mb-6 transition-all duration-300 group-hover:bg-accent group-hover:text-white"
                  style={{ width: '52px', height: '52px', background: 'rgba(229,9,20,0.1)' }}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-white tracking-tight" style={{ fontSize: '18px', marginBottom: '12px' }}>{feature.title}</h3>
                <p className="font-body text-[#6e6e73] leading-relaxed" style={{ fontSize: '14px' }}>{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
          style={{ gap: '24px', background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px 36px', marginTop: '40px' }}
        >
          <p className="font-body text-[#a1a1a6] leading-relaxed" style={{ fontSize: '16px', maxWidth: '560px' }}>{footerNote}</p>
          <a href={ctaHref} className="btn-primary flex-shrink-0 group">
            {ctaLabel}
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicePageLayout;
