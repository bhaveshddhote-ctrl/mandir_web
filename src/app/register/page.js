'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, Send, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { registerRequest } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await registerRequest(formData);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(res.error || 'Failed to submit request');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center" 
      style={{
        backgroundColor: '#0F172A',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #1E293B 0%, #0F172A 100%)'
      }}
    >
      <div className="w-full max-w-2xl animate-fade-in">
        <Link href="/login" 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-8 w-fit"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', marginBottom: '32px', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} />
          <span>Back to Login</span>
        </Link>

        <div className="glass-card p-10" 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '40px'
          }}
        >
          {!success ? (
            <>
              <h1 style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '2.5rem', color: '#D4601A', marginBottom: '10px' }}>
                Member Registration Request
              </h1>
              <p style={{ color: '#94A3B8', marginBottom: '40px' }}>
                Apply to become a member of Guru Gorakhnath Math management.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ position: 'relative' }}>
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" 
                      style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} 
                    />
                    <input
                      name="name"
                      placeholder="Full Name"
                      className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4601A] transition-all"
                      style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', color: '#fff', padding: '12px 12px 12px 48px', borderRadius: '12px', outline: 'none' }}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4601A] transition-all"
                      style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', color: '#fff', padding: '12px 12px 12px 48px', borderRadius: '12px', outline: 'none' }}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                    />
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4601A] transition-all"
                      style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', color: '#fff', padding: '12px 12px 12px 48px', borderRadius: '12px', outline: 'none' }}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                    />
                    <input
                      name="location"
                      placeholder="Location"
                      className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4601A] transition-all"
                      style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', color: '#fff', padding: '12px 12px 12px 48px', borderRadius: '12px', outline: 'none' }}
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea
                    name="message"
                    placeholder="Briefly state your purpose/background..."
                    className="w-full bg-slate-800/50 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-[#D4601A] transition-all"
                    style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', color: '#fff', padding: '16px', borderRadius: '12px', outline: 'none', minHeight: '120px' }}
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D4601A] hover:bg-[#BF5617] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
                  style={{ width: '100%', backgroundColor: '#D4601A', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}
                >
                  {loading ? 'Submitting...' : 'Send Request'}
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={40} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '2rem', color: '#10B981', marginBottom: '16px' }}>
                Request Submitted!
              </h2>
              <p style={{ color: '#94A3B8' }}>
                Your request has been sent to the administrators. You will be redirected to the login page shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
