// src/components/ExitIntentPopup.jsx
// Shows on exit intent (desktop) or after 45 seconds (mobile).
// Only shows once per session. Gives code SPEC10 for 10% off.
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Copy, Check } from 'lucide-react';

const COUPON = 'SPEC10';
const SESSION_KEY = 'spec360-exit-popup-shown';

const ExitIntentPopup = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const shownRef = useRef(false);

  const show = () => {
    if (shownRef.current) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    shownRef.current = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(true);
  };

  useEffect(() => {
    // Desktop: mouse leaves viewport top
    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) show();
    };

    // Mobile / fallback: show after 45 seconds
    const timer = setTimeout(show, 45000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const dismiss = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)'
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 201,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px'
            }}
          >
            <div style={{
              width: '100%', maxWidth: '440px',
              background: '#111',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Red top band */}
              <div style={{
                background: 'linear-gradient(135deg, #E50914 0%, #b00710 100%)',
                padding: '32px 36px 28px'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.2)', borderRadius: '100px',
                  padding: '6px 14px', marginBottom: '16px'
                }}>
                  <Tag size={13} color="white" />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', color: 'white', fontWeight: 600, letterSpacing: '0.08em' }}>
                    FIRST ORDER OFFER
                  </span>
                </div>
                <h2 style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: '38px', color: 'white', lineHeight: 1.05,
                  letterSpacing: '-0.03em', margin: 0
                }}>
                  10% OFF<br />Your First Order
                </h2>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginTop: '12px' }}>
                  Use code at checkout — limited time.
                </p>
              </div>

              {/* Code section */}
              <div style={{ padding: '28px 36px 32px' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Your discount code
                </p>
                <button
                  onClick={handleCopy}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#1a1a1a', border: '2px dashed rgba(229,9,20,0.4)', borderRadius: '14px',
                    padding: '16px 20px', cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                >
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '28px', color: 'white', letterSpacing: '0.06em' }}>
                    {COUPON}
                  </span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500,
                    color: copied ? '#22c55e' : '#E50914',
                    transition: 'color 0.2s'
                  }}>
                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                  </span>
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                  <a
                    href="/services/phones-accessories"
                    onClick={dismiss}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '14px 24px', textDecoration: 'none' }}
                  >
                    Shop Now & Save
                  </a>
                  <button
                    onClick={dismiss}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif', color: '#6e6e73', fontSize: '13px'
                    }}
                  >
                    No thanks, I'll pay full price
                  </button>
                </div>
              </div>

              {/* Close X */}
              <button
                onClick={dismiss}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'white'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
