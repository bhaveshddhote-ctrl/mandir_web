'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import {
  Globe, FileText, Calendar, Phone, Save,
  CheckCircle, AlertCircle, Plus, Trash2, RefreshCw,
  QrCode, CreditCard, Upload, ImageIcon, X
} from 'lucide-react';

const cardStyle = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export default function WebsiteCMSPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Content States
  const [hero, setHero] = useState({ eyebrow: '', title: '', sub: '', location: '' });
  const [history, setHistory] = useState({ eyebrow: '', title: '', p1: '', p2: '' });
  const [festivals, setFestivals] = useState([]);
  const [contact, setContact] = useState({ phone: '', email: '', address: '', timing: '' });
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    branch: '',
    upiId: '',
    qrImage: ''
  });

  // QR Code upload state
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const qrInputRef = useRef(null);

  // New Festival form state
  const [newFest, setNewFest] = useState({ date: '', name: '', desc: '' });
  const [showFestForm, setShowFestForm] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-content');
      if (res.ok) {
        const data = await res.json();
        if (data.hero) setHero(data.hero);
        if (data.history) setHistory(data.history);
        if (data.festivals) setFestivals(data.festivals);
        if (data.contact) setContact(data.contact);
        if (data.bankDetails) setBankDetails(data.bankDetails);
      }
    } catch (e) {
      showToast('error', 'Content load nahi ho saka');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleQrUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Sirf image files allowed hain');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setQrPreview(e.target.result);
      setBankDetails(prev => ({ ...prev, qrImage: e.target.result }));
    };
    reader.readAsDataURL(file);
    showToast('success', 'QR Image loaded! Live publish ke liye Save click karein.');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero, history, festivals, contact, bankDetails })
      });

      if (res.ok) {
        showToast('success', '✅ Public Website Content Live Update ho gaya!');
      } else {
        showToast('error', '❌ Save karne me issue aaya.');
      }
    } catch (e) {
      showToast('error', '❌ Network error');
    } finally {
      setSaving(false);
    }
  };

  const addFestival = () => {
    if (!newFest.name || !newFest.date) {
      showToast('error', 'Festival Name aur Date zaroori hain');
      return;
    }
    const item = { id: `fest_${Date.now()}`, ...newFest };
    setFestivals([...festivals, item]);
    setNewFest({ date: '', name: '', desc: '' });
    setShowFestForm(false);
    showToast('success', 'Festival add ho gaya! Ab Save Publish click karein');
  };

  const removeFestival = (id) => {
    setFestivals(festivals.filter(f => f.id !== id));
    showToast('success', 'Festival removed! Website update ke liye Save click karein');
  };

  return (
    <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Top Bar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>
                🌐 Website Content Manager (CMS)
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Public Website ke saare text, history, events, gallery, bank details aur UPI QR code manage karein.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={fetchContent} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', borderRadius: '10px',
                border: '1px solid #E2E8F0', background: '#fff', color: '#64748B',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
              }}>
                <RefreshCw size={15} /> Reset
              </button>
              <button onClick={handleSaveAll} disabled={saving} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #D4601A, #B54A10)', color: '#fff',
                border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem', fontWeight: 700,
                boxShadow: '0 4px 14px rgba(212,96,26,0.35)',
              }}>
                <Save size={18} />
                {saving ? 'Publishing...' : '🚀 Save & Publish Live'}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', gap: '8px', paddingBottom: '2px', overflowX: 'auto' }}>
            {[
              { id: 'hero', label: '🚩 Main Banner / Hero', icon: Globe },
              { id: 'history', label: '📜 Mandir History', icon: FileText },
              { id: 'festivals', label: '📅 Festivals & Events', icon: Calendar },
              { id: 'contact', label: '📞 Contact Details', icon: Phone },
              { id: 'bank', label: '💳 Bank & UPI QR Code', icon: CreditCard },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 18px', border: 'none', background: 'none',
                    borderBottom: isActive ? '3px solid #D4601A' : '3px solid transparent',
                    color: isActive ? '#D4601A' : '#64748B',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>Loading CMS Content...</div>
          ) : (
            <>
              {/* TAB 1: HERO */}
              {activeTab === 'hero' && (
                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                    🚩 Hero Banner Configuration
                  </h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Eyebrow Tagline (Top Pill)</label>
                    <input type="text" value={hero.eyebrow} onChange={e => setHero({ ...hero, eyebrow: e.target.value })}
                      placeholder="e.g. अलख निरंजन"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Main Title</label>
                    <input type="text" value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })}
                      placeholder="e.g. श्री गुरु गोरखनाथ मठ"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Subtitle Description</label>
                    <textarea rows={2} value={hero.sub} onChange={e => setHero({ ...hero, sub: e.target.value })}
                      placeholder="e.g. नाथ संप्रदाय की सिद्ध परंपरा..."
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Location Name</label>
                    <input type="text" value={hero.location} onChange={e => setHero({ ...hero, location: e.target.value })}
                      placeholder="e.g. निमनवाड़ा"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              )}

              {/* TAB 2: HISTORY */}
              {activeTab === 'history' && (
                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                    📜 Mandir History (इतिहास)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Section Eyebrow</label>
                      <input type="text" value={history.eyebrow} onChange={e => setHistory({ ...history, eyebrow: e.target.value })}
                        placeholder="e.g. परंपरा"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Section Title</label>
                      <input type="text" value={history.title} onChange={e => setHistory({ ...history, title: e.target.value })}
                        placeholder="e.g. मठ का इतिहास"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>History Paragraph 1</label>
                    <textarea rows={4} value={history.p1} onChange={e => setHistory({ ...history, p1: e.target.value })}
                      placeholder="Math history details..."
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>History Paragraph 2</label>
                    <textarea rows={4} value={history.p2} onChange={e => setHistory({ ...history, p2: e.target.value })}
                      placeholder="Festivals and annual event tradition paragraph..."
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                </div>
              )}

              {/* TAB 3: FESTIVALS & EVENTS */}
              {activeTab === 'festivals' && (
                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>
                      📅 Festivals & Events List
                    </h3>
                    <button onClick={() => setShowFestForm(!showFestForm)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '8px', border: 'none',
                      background: '#EEF2FF', color: '#6366F1', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem'
                    }}>
                      <Plus size={16} /> Add New Festival
                    </button>
                  </div>

                  {showFestForm && (
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>Naya Festival Add Karein</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <input placeholder="Festival Date/Month (e.g. फाल्गुन, माघ पूर्णिमा)" value={newFest.date} onChange={e => setNewFest({ ...newFest, date: e.target.value })}
                          style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }} />
                        <input placeholder="Festival Name (e.g. महाशिवरात्रि)" value={newFest.name} onChange={e => setNewFest({ ...newFest, name: e.target.value })}
                          style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }} />
                      </div>
                      <input placeholder="Short Description (e.g. रात्रि जागरण एवं रुद्राभिषेक)" value={newFest.desc} onChange={e => setNewFest({ ...newFest, desc: e.target.value })}
                        style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }} />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowFestForm(false)} style={{ padding: '6px 12px', background: '#E2E8F0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                        <button onClick={addFestival} style={{ padding: '6px 14px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Add to List</button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {festivals.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px', background: '#F8FAFC', borderRadius: '12px', color: '#94A3B8' }}>
                        <p style={{ fontWeight: 600, color: '#64748B' }}>Koi festival added nahi hai.</p>
                        <p style={{ fontSize: '0.8rem' }}>Admin dashboard se saare delete ho gaye hain — Website par bhi 0 dikhega.</p>
                      </div>
                    ) : (
                      festivals.map((f, i) => (
                        <div key={f.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <span style={{ padding: '4px 10px', background: '#FEF3C7', color: '#D97706', fontWeight: 700, borderRadius: '6px', fontSize: '0.8rem' }}>
                              {f.date}
                            </span>
                            <div>
                              <p style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.95rem' }}>{f.name}</p>
                              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{f.desc}</p>
                            </div>
                          </div>
                          <button onClick={() => removeFestival(f.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#EF4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT */}
              {activeTab === 'contact' && (
                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                    📞 Contact Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Phone Number</label>
                      <input type="text" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
                      <input type="text" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}
                        placeholder="info@gorakhnathmath.org"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Mandir Address</label>
                    <input type="text" value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })}
                      placeholder="श्री गुरु गोरखनाथ मठ, ग्राम निमनवाड़ा"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Mandir Opening Timings</label>
                    <input type="text" value={contact.timing} onChange={e => setContact({ ...contact, timing: e.target.value })}
                      placeholder="प्रातः 5:00 बजे से रात्रि 9:00 बजे तक"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              )}

              {/* TAB 5: BANK & UPI DETAILS */}
              {activeTab === 'bank' && (
                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    💳 Donation Bank & UPI QR Code Management
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                    Yeh details Public Website ke **"दान (Donation)"** section mein live dikhai dengi.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                    {/* Bank Info Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Bank Name *</label>
                        <input type="text" value={bankDetails.bankName} onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          placeholder="e.g. State Bank of India"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Account Holder Name *</label>
                        <input type="text" value={bankDetails.accountName} onChange={e => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                          placeholder="e.g. Shri Guru Gorakhnath Math Trust"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Account Number *</label>
                          <input type="text" value={bankDetails.accountNumber} onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                            placeholder="39485720194"
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>IFSC Code *</label>
                          <input type="text" value={bankDetails.ifsc} onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                            placeholder="SBIN0001234"
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Branch Name</label>
                          <input type="text" value={bankDetails.branch} onChange={e => setBankDetails({ ...bankDetails, branch: e.target.value })}
                            placeholder="Nimanwada"
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>UPI ID (GPay / PhonePe) *</label>
                          <input type="text" value={bankDetails.upiId} onChange={e => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                            placeholder="gorakhnathmath@upi"
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                    </div>

                    {/* QR Code Upload / Preview Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F8FAFC', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                        📲 UPI QR Code Image
                      </p>

                      <div
                        onClick={() => qrInputRef.current?.click()}
                        style={{
                          width: '180px', height: '180px',
                          border: '2px dashed #CBD5E1', borderRadius: '12px',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', background: '#fff', overflow: 'hidden', position: 'relative'
                        }}
                      >
                        {bankDetails.qrImage || qrPreview ? (
                          <>
                            <img src={qrPreview || bankDetails.qrImage} alt="QR Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                            <button onClick={e => { e.stopPropagation(); setBankDetails(prev => ({ ...prev, qrImage: '' })); setQrPreview(null); }} style={{
                              position: 'absolute', top: '4px', right: '4px',
                              background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                              width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                            }}>
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <QrCode size={40} color="#94A3B8" style={{ marginBottom: '8px' }} />
                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textAlign: 'center' }}>
                              Click to Upload QR Code Image
                            </span>
                          </>
                        )}
                        <input ref={qrInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleQrUpload(e.target.files[0])} />
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center' }}>
                        Devotees website par scan karke direct daan kar sakege
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000,
            background: '#1E293B', color: '#fff', padding: '12px 20px',
            borderRadius: '12px', fontSize: '0.88rem', fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px',
            borderLeft: `4px solid ${toast.type === 'success' ? '#16A34A' : '#EF4444'}`,
          }}>
            {toast.type === 'success' ? <CheckCircle size={16} color="#16A34A" /> : <AlertCircle size={16} color="#EF4444" />}
            {toast.msg}
          </div>
        )}

      </DashboardLayout>
    </RoleGuard>
  );
}
