// src/components/WhatsAppButton.jsx
// Floating WhatsApp bubble — pulsing green ring, pre-filled message
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const WA_NUMBER = '2348182799154';
const WA_DEFAULT_MSG = encodeURIComponent("Hi! I'm interested in buying from Spec360. Can you help me?");

const WhatsAppButton = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute', bottom: '70px', right: 0,
              width: '300px',
              background: '#111', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
            }}
          >
            {/* Header */}
            <div style={{ background: '#25D366', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0
              }}>
                <WhatsAppIcon />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'white', fontSize: '15px', margin: 0 }}>Spec360 Support</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>
                  <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#fff', marginRight: '5px', verticalAlign: 'middle' }} />
                  Typically replies in minutes
                </p>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {/* Chat bubble */}
            <div style={{ padding: '20px' }}>
              <div style={{
                background: '#1a1a1a', borderRadius: '4px 16px 16px 16px',
                padding: '12px 16px', display: 'inline-block', maxWidth: '85%'
              }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#f5f5f7', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                  👋 Hello! Looking for genuine iPhone or Samsung parts? We've got the best prices in Nigeria!
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '11px', margin: '6px 0 0' }}>Spec360 · Just now</p>
              </div>
            </div>

            {/* Quick messages */}
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '🛍️ Buy a Phone',    msg: "Hi Spec360! I'd like to buy a phone. What smartphones do you have available and what are the prices?" },
                { label: '🔩 iPhone Parts',   msg: "Hi! I'm looking for genuine iPhone parts. What do you have available?" },
                { label: '🔧 Repair Quote',   msg: 'Hi! I need a phone repair. Can I get a quote and estimated time?' },
                { label: '🛒 Accessories',    msg: 'Hi! I\'d like to see your accessories — cases, chargers, screen guards?' },
              ].map(({ label, msg }) => (
                <a
                  key={label}
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', textAlign: 'center',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500,
                    color: '#25D366', border: '1px solid rgba(37,211,102,0.25)',
                    borderRadius: '10px', padding: '10px 14px',
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: '#25D366', pointerEvents: 'none'
        }}
      />

      {/* Main button */}
      <motion.button
        onClick={() => setChatOpen(p => !p)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
        aria-label="Chat on WhatsApp"
        style={{
          position: 'relative',
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#25D366', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', boxShadow: '0 8px 24px rgba(37,211,102,0.4)',
        }}
      >
        <WhatsAppIcon />
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
