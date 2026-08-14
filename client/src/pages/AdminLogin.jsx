// src/pages/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await login(email, password);
    if (result.success) navigate('/admin/products');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <section className="w-full bg-[#080808] flex items-center justify-center" style={{ minHeight: '100vh', padding: '80px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        <div className="text-center" style={{ marginBottom: '36px' }}>
          <div className="font-display font-bold text-white tracking-tight" style={{ fontSize: '22px', marginBottom: '8px' }}>
            Spec<span className="text-accent">360</span>
          </div>
          <h1 className="font-display font-bold text-white tracking-tight" style={{ fontSize: '32px' }}>Admin Portal</h1>
          <p className="font-body text-[#6e6e73]" style={{ fontSize: '15px', marginTop: '8px' }}>Sign in to manage your store</p>
        </div>

        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '36px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a3a3a]" strokeWidth={1.5} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field pl-11" placeholder="admin@spec360.com.ng" required />
              </div>
            </div>
            <div>
              <label className="font-body text-[#6e6e73] uppercase tracking-wider block" style={{ fontSize: '11px', marginBottom: '8px' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a3a3a]" strokeWidth={1.5} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="input-field pl-11" placeholder="••••••••" required />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-body text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl"
                style={{ fontSize: '14px', padding: '12px 16px' }}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center group disabled:opacity-50"
              style={{ marginTop: '4px', padding: '16px 32px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default AdminLogin;
