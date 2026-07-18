'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import { Plus, Search, RefreshCw, Trash2, X, CheckCircle } from 'lucide-react';

const cardStyle = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    desc: '',
    name: '',
    amount: '',
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ledger');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.filter(e => e.type === 'out'));
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.desc.trim() || !form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    try {
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          type: 'out',
          desc: form.desc,
          name: form.name,
          amount: Number(form.amount),
          passcode: 'namah108',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        setForm({ date: new Date().toISOString().slice(0, 10), desc: '', name: '', amount: '' });
        await fetchExpenses();
        showToast('✅ Expense entry added successfully!');
      } else {
        showToast('❌ Error: ' + (data.error || 'Could not save'));
      }
    } catch {
      showToast('❌ Network error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Is expense entry ko delete karna chahte hain?')) return;
    try {
      const res = await fetch(`/api/ledger/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchExpenses();
        showToast('🗑️ Entry deleted.');
      } else {
        showToast('❌ Delete failed.');
      }
    } catch {
      showToast('❌ Network error.');
    }
  };

  const filtered = expenses.filter(d =>
    (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.desc || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  const formatDate = (d) => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Trustee']}>
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>
                💸 Expenses (Vyay)
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Guru Gorakhnath Math ke sabhi kharche ka vivaran
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={fetchExpenses} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', borderRadius: '10px',
                border: '1px solid #E2E8F0', background: '#fff', color: '#64748B',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
              }}>
                <RefreshCw size={15} /> Refresh
              </button>
              <button onClick={() => setShowModal(true)} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '10px',
                backgroundColor: '#DC2626', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
              }}>
                <Plus size={18} /> Add Expense
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ ...cardStyle, borderLeft: '4px solid #DC2626' }}>
              <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '4px' }}>Total Expenses</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#DC2626' }}>₹{totalAmount.toLocaleString('en-IN')}</h3>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #D4601A' }}>
              <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '4px' }}>Total Entries</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#D4601A' }}>{expenses.length}</h3>
            </div>
          </div>

          {/* Table Card */}
          <div style={cardStyle}>
            <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '20px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by vendor or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 42px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.88rem', background: '#F8FAFC' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94A3B8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94A3B8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Vendor / Purpose</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94A3B8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Description</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94A3B8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', color: '#94A3B8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>Koi expense entry nahi mili</div>
                      <div style={{ fontSize: '0.82rem' }}>Upar "Add Expense" button se entry karo</div>
                    </td></tr>
                  ) : (
                    filtered.map((item, i) => (
                      <tr key={item._id || i} style={{ borderBottom: '1px solid #F1F5F9' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', color: '#64748B' }}>{formatDate(item.date)}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1E293B' }}>{item.name || <span style={{ color: '#CBD5E1' }}>—</span>}</td>
                        <td style={{ padding: '14px 16px', color: '#475569' }}>{item.desc}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>−₹{item.amount?.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button onClick={() => handleDelete(item._id)} style={{
                            background: '#FEF2F2', border: 'none', borderRadius: '8px',
                            padding: '6px 10px', cursor: 'pointer', color: '#EF4444'
                          }}>
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E293B' }}>➕ New Expense Entry</h3>
                <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Vendor / Paid To (Optional)</label>
                  <input type="text" placeholder="e.g. Kiryana Bhandar, Gopal Painters" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Description *</label>
                  <input type="text" placeholder="e.g. Bhandara Ration, Bijli Bill, Paint Kaam" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} required
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Amount (₹) *</label>
                  <input type="number" placeholder="0" min="1" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0',
                    background: '#fff', color: '#64748B', fontWeight: 600, cursor: 'pointer'
                  }}>Cancel</button>
                  <button type="submit" disabled={saving} style={{
                    flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
                    background: '#DC2626', color: '#fff', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
                  }}>{saving ? 'Saving...' : '✅ Save Expense'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: '24px', right: '24px', background: '#1E293B',
            color: '#fff', padding: '12px 20px', borderRadius: '12px', fontSize: '0.88rem',
            fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            borderLeft: '4px solid #DC2626', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <CheckCircle size={16} color="#DC2626" /> {toast}
          </div>
        )}

      </DashboardLayout>
    </RoleGuard>
  );
}
