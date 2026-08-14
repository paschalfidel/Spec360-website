import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Target, Heart, Rocket, Shield, Truck } from 'lucide-react';
import ImageWithPlaceholder from './ImageWithPlaceholder';

const values = [
  { icon: Sparkles, title: 'Spectacular Quality', desc: 'Excellence in every device, repair, and line of code.' },
  { icon: Target, title: 'Specific Solutions', desc: 'Tailored, need-based services — never generic.' },
  { icon: Heart, title: 'Special Service', desc: 'People-first, trust-driven at every step.' },
  { icon: Rocket, title: 'Innovation', desc: 'Continuous improvement through learning.' },
  { icon: Shield, title: 'Integrity', desc: 'Honest advice and fully reliable delivery.' },
  { icon: Truck,  title: 'Swift Delivery',           desc: 'Fast, trackable dispatch to Lagos, Owerri & beyond' },
];

const VisionMissionValues = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.06 });

  return (
    <section id="vision-mission-values" className="w-full bg-[#080808]" style={{ padding: '96px 0' }}>
      <div className="site-container">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
          style={{ marginBottom: '48px' }}
        >
          <div className="w-8 h-px bg-accent" />
          <span className="text-accent font-body text-[12px] font-medium tracking-[0.18em] uppercase">Our Identity</span>
        </motion.div>

        {/* Vision + Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '20px', marginBottom: '72px' }}>
          {[
            {
              src: '/images/spec360-vision.PNG',
              title: 'Our Vision',
              content: 'To become a leading 360° tech and digital solutions brand in Nigeria and beyond — known for delivering spectacular quality, specific solutions, and special service.',
              isList: false,
            },
            {
              src: '/images/spec360-mission.png',
              title: 'Our Mission',
              isList: true,
              items: [
                'Reliable smartphones, accessories, and professional repairs',
                'Modern, scalable web solutions for individuals and businesses',
                'Technical expertise combined with customer-centric thinking',
                'Continuous evolution through innovation and execution',
              ],
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
              className="relative rounded-2xl overflow-hidden"
              style={{ minHeight: '320px', background: '#111' }}
            >
              <ImageWithPlaceholder
                src={card.src} alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.2 }}
                placeholderText=""
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(17,17,17,0.95) 30%, rgba(17,17,17,0.6) 100%)' }} />
              <div className="relative z-10 flex flex-col justify-end" style={{ padding: '36px', height: '100%' }}>
                <div className="w-8 h-px bg-accent" style={{ marginBottom: '16px' }} />
                <h3 className="font-display font-bold text-white tracking-tight" style={{ fontSize: '26px', marginBottom: '16px' }}>{card.title}</h3>
                {card.isList ? (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {card.items.map((item, j) => (
                      <li key={j} className="font-body text-[#a1a1a6] flex items-start gap-2.5" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        <span className="text-accent flex-shrink-0 mt-0.5">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-body text-[#a1a1a6]" style={{ fontSize: '15px', lineHeight: '1.75' }}>{card.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Values */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-display font-bold text-white text-center tracking-tight"
          style={{ fontSize: 'clamp(26px, 3vw, 42px)', marginBottom: '36px' }}
        >
          Core <span className="text-accent">Values</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '16px' }}>
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.4 + i * 0.07 }}
                whileHover={{ y: -4 }}
                className="rounded-xl text-center transition-all duration-300 hover:border-white/20"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', padding: '28px 20px' }}
              >
                <div className="flex justify-center" style={{ marginBottom: '16px' }}>
                  <div className="flex items-center justify-center rounded-xl text-accent"
                    style={{ width: '44px', height: '44px', background: 'rgba(229,9,20,0.1)' }}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-white tracking-tight" style={{ fontSize: '13px', marginBottom: '8px' }}>{val.title}</h3>
                <p className="font-body text-[#6e6e73]" style={{ fontSize: '12px', lineHeight: '1.6' }}>{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VisionMissionValues;
