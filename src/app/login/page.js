'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Flame } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  const fillDemo = () => {
    setEmail('admin@mandir.com');
    setPassword('mandir@2024');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #1a0608 0%, #3d0e14 40%, #6E1423 70%, #2B2420 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background decorative elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,135,30,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,20,35,0.4) 0%, transparent 70%)' }} />
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(176,141,63,0.03) 0px, rgba(176,141,63,0.03) 1px, transparent 1px, transparent 40px)', opacity: 0.8 }} />
      </div>

      {/* Left Panel — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        position: 'relative',
        zIndex: 1,
      }} className="left-panel">
        {/* Flame */}
        <div style={{ marginBottom: '32px', position: 'relative', width: '80px', height: '100px', margin: '0 auto 32px' }}>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '70px', height: '20px', background: 'radial-gradient(ellipse, #1a1512, #0d0a08)', borderRadius: '50%', boxShadow: '0 0 20px 4px rgba(232,135,30,0.3)' }} />
          <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', width: '28px', height: '56px', background: 'linear-gradient(0deg, #6E1423 0%, #C1652F 45%, #E8871E 75%, #FFD98C 100%)', borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%', animation: 'flicker 2.6s ease-in-out infinite', filter: 'blur(0.5px)' }} />
        </div>

        <div style={{ textAlign: 'center', color: '#F4E9D6' }}>
          <div style={{ fontSize: '0.78rem', letterSpacing: '4px', color: '#E8871E', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
            अलख निरंजन
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', lineHeight: 1.3, marginBottom: '8px', fontFamily: 'var(--font-yatra-one)' }}>
            श्री गुरु गोरखनाथ मठ
          </h1>
          <p style={{ color: '#B08D3F', fontSize: '0.88rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '40px' }}>
            निमनवाड़ा
          </p>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #E8871E, transparent)', margin: '0 auto 40px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '280px', margin: '0 auto' }}>
            {[
              { emoji: '🔱', text: 'Donations & Expenses Track' },
              { emoji: '📊', text: 'Real-time Financial Dashboard' },
              { emoji: '🔒', text: 'Secure Admin Access' },
              { emoji: '🌐', text: 'Public Ledger Transparency' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EADFC7', fontSize: '0.85rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.emoji}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        width: '480px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        background: 'rgba(255,255,255,0.97)',
        position: 'relative',
        zIndex: 1,
        boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
      }} className="right-panel">
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {/* Form Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #E8871E, #C1652F)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 20px rgba(232,135,30,0.35)' }}>
              <Lock size={22} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E293B', marginBottom: '6px' }}>
              Admin Login
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
              Apna email aur password darj karein
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="email"
                  placeholder="admin@mandir.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '13px 14px 13px 44px',
                    border: '1.5px solid #E2E8F0', borderRadius: '12px',
                    fontSize: '0.9rem', outline: 'none', background: '#F8FAFC',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#E8871E'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '13px 44px 13px 44px',
                    border: '1.5px solid #E2E8F0', borderRadius: '12px',
                    fontSize: '0.9rem', outline: 'none', background: '#F8FAFC',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#E8871E'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #E8871E, #C1652F)',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(232,135,30,0.4)',
                transition: 'all 0.2s', marginTop: '4px'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Credentials Info Box */}
          <div style={{
            marginTop: '28px', padding: '16px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFF7ED, #FFFBF5)',
            border: '1px solid #FED7AA',
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🔑 Default Admin Credentials
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.83rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78350F' }}>Email:</span>
                <code style={{ color: '#C1652F', fontWeight: 700 }}>admin@mandir.com</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78350F' }}>Password:</span>
                <code style={{ color: '#C1652F', fontWeight: 700 }}>mandir@2024</code>
              </div>
            </div>
            <button
              onClick={fillDemo}
              style={{
                width: '100%', marginTop: '10px', padding: '8px',
                background: '#E8871E', color: '#fff', border: 'none',
                borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ⚡ Auto-Fill Credentials
            </button>
          </div>

          <p style={{ marginTop: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
            Password change karna hai?{' '}
            <Link href="/dashboard/settings" style={{ color: '#E8871E', fontWeight: 600, textDecoration: 'none' }}>
              Settings pe jao
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes flicker {
          0%, 100% { transform: translateX(-50%) scaleY(1) skewX(0deg); }
          25% { transform: translateX(-50%) scaleY(1.08) skewX(-3deg); }
          50% { transform: translateX(-52%) scaleY(0.94) skewX(2deg); }
          75% { transform: translateX(-48%) scaleY(1.05) skewX(-1deg); }
        }
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
