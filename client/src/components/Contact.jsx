// src/components/Contact.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, formData);
      setStatus({ type: 'success', message: "Message sent. We'll be in touch shortly." });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: MapPin, label: 'Visit Us', value: '70 Njemanze Street, Owerri Municipal, Imo', href: null },
    { icon: Phone, label: 'Call Us', value: '0818 279 9154', href: 'tel:08182799154' },
    { icon: Mail, label: 'Email Us', value: 'info@spec360.com.ng', href: 'mailto:info@spec360.com.ng' },
  ];

  const socials = [
    { icon: Instagram, href: 'https://www.instagram.com/gadgetsbyspec360/', label: 'Instagram' },
    { icon: Twitter, href: 'https://x.com/paschalomens', label: 'Twitter/X' },
    { icon: Facebook, href: 'https://web.facebook.com/spec360com', label: 'Facebook' },
  ];

  return (
    <section id="contact" className="w-full bg-[#080808]" style={{ padding: '96px 0' }}>
      <div className="site-container">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '56px' }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div className="w-8 h-px bg-accent" />
            <span className="text-accent font-body text-[12px] font-medium tracking-[0.18em] uppercase">Contact</span>
          </div>
          <h2 className="font-display font-bold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 58px)' }}>
            Let's Talk
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: '48px' }}>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2"
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start" style={{ gap: '16px' }}>
                  <div className="flex items-center justify-center rounded-xl text-accent flex-shrink-0"
                    style={{ width: '44px', height: '44px', background: 'rgba(229,9,20,0.1)', marginTop: '2px' }}>
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-body text-[#6e6e73] uppercase tracking-wider" style={{ fontSize: '11px', marginBottom: '5px' }}>{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="font-body text-white hover:text-accent transition-colors" style={{ fontSize: '15px' }}>{item.value}</a>
                      : <p className="font-body text-white" style={{ fontSize: '15px' }}>{item.value}</p>
                    }
                  </div>
                </div>
              );
            })}

            <div>
              <p className="font-body text-[#6e6e73] uppercase tracking-wider" style={{ fontSize: '11px', marginBottom: '14px' }}>Follow Us</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {socials.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className="flex items-center justify-center text-[#6e6e73] hover:text-white transition-all duration-300 hover:border-white/20"
                      style={{ width: '40px', height: '40px', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                      <Icon size={16} strokeWidth={1.5} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit}
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '16px' }}>
                <div>
                  <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>Name</label>
                  <input type="text" name="name" placeholder="Your name" value={formData.name}
                    onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>Email</label>
                  <input type="email" name="email" placeholder="you@email.com" value={formData.email}
                    onChange={handleChange} required className="input-field" />
                </div>
              </div>
              <div>
                <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>Message</label>
                <textarea name="message" placeholder="Tell us what you need..." rows="6"
                  value={formData.message} onChange={handleChange} required
                  className="input-field" style={{ resize: 'none' }} />
              </div>
              <div className="flex items-center justify-between" style={{ paddingTop: '4px' }}>
                <button type="submit" disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed group">
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                {status.message && (
                  <p className={`font-body text-[13px] ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {status.message}
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
