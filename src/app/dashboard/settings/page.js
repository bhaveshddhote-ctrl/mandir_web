'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/context/AuthContext';
import { Save, Eye, EyeOff, User, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const cardStyle = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '28px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #E2E8F0',
  borderRadius: '10px',
  fontSize: '0.9rem',
  outline: 'none',
  background: '#F8FAFC',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#64748B',
  marginBottom: '7px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export default function SettingsPage() {
  const { user } = useAuth();

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name || '' });
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg, setPassMsg] = useState(null);
  const [passSaving, setPassSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Ledger passcode form
  const [ledgerPass, setLedgerPass] = useState({ current: '', newCode: '', confirm: '' });
  const [ledgerMsg, setLedgerMsg] = useState(null);
  const [ledgerSaving, setLedgerSaving] = useState(false);

  const showMessage = (setter, type, text) => {
    setter({ type, text });
    setTimeout(() => setter(null), 4000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    setProfileSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileForm.name, email: user?.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMessage(setProfileMsg, 'success', '✅ Profile updated! Re-login to see changes.');
      } else {
        showMessage(setProfileMsg, 'error', '❌ ' + (data.error || 'Update failed'));
      }
    } catch {
      showMessage(setProfileMsg, 'error', '❌ Network error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) {
      showMessage(setPassMsg, 'error', '❌ New passwords do not match!');
      return;
    }
    if (passForm.newPass.length < 6) {
      showMessage(setPassMsg, 'error', '❌ Password kam se kam 6 characters ka hona chahiye');
      return;
    }
    setPassSaving(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: passForm.current,
          newPassword: passForm.newPass,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassForm({ current: '', newPass: '', confirm: '' });
        showMessage(setPassMsg, 'success', '✅ Password successfully changed!');
      } else {
        showMessage(setPassMsg, 'error', '❌ ' + (data.error || 'Password change failed'));
      }
    } catch {
      showMessage(setPassMsg, 'error', '❌ Network error');
    } finally {
      setPassSaving(false);
    }
  };

  const handleLedgerPassChange = async (e) => {
    e.preventDefault();
    if (ledgerPass.newCode !== ledgerPass.confirm) {
      showMessage(setLedgerMsg, 'error', '❌ New passcodes do not match!');
      return;
    }
    if (ledgerPass.newCode.length < 4) {
      showMessage(setLedgerMsg, 'error', '❌ Passcode kam se kam 4 characters ka hona chahiye');
      return;
    }
    setLedgerSaving(true);
    try {
      const res = await fetch('/api/admin/ledger-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPasscode: ledgerPass.current,
          newPasscode: ledgerPass.newCode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLedgerPass({ current: '', newCode: '', confirm: '' });
        showMessage(setLedgerMsg, 'success', '✅ Ledger passcode changed!');
      } else {
        showMessage(setLedgerMsg, 'error', '❌ ' + (data.error || 'Passcode change failed'));
      }
    } catch {
      showMessage(setLedgerMsg, 'error', '❌ Network error');
    } finally {
      setLedgerSaving(false);
    }
  };

  const MessageBox = ({ msg }) => msg ? (
    <div style={{
      padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px',
      background: msg.type === 'success' ? '#F0FDF4' : '#FEF2F2',
      border: `1px solid ${msg.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
      color: msg.type === 'success' ? '#16A34A' : '#DC2626',
    }}>
      {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg.text}
    </div>
  ) : null;

  const PwInput = ({ value, onChange, placeholder, show, toggleShow }) => (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: '44px' }}
        required
        onFocus={e => e.target.style.borderColor = '#E8871E'}
        onBlur={e => e.target.style.borderColor = '#E2E8F0'}
      />
      <button type="button" onClick={toggleShow} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );

  return (
    <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>

          {/* Page Header */}
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>
              ⚙️ Settings
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Admin credentials aur system settings manage karein
            </p>
          </div>

          {/* Current Credentials Info */}
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #FFF7ED, #FFFBF5)', border: '1px solid #FED7AA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E8871E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400E' }}>Current Admin Account</h3>
                <p style={{ fontSize: '0.78rem', color: '#B45309' }}>Logged in as</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Name', value: user?.name || 'Mandir Admin' },
                { label: 'Role', value: user?.role || 'Super Admin' },
                { label: 'Email', value: user?.email || 'admin@mandir.com' },
                { label: 'Ledger Passcode', value: 'namah108 (default)' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '12px 14px' }}>
                  <p style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E293B' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Update Profile Name */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>Profile Name</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Display naam change karein</p>
              </div>
            </div>
            <form onSubmit={handleProfileSave} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ name: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  style={inputStyle}
                  required
                  onFocus={e => e.target.style.borderColor = '#E8871E'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
              <button type="submit" disabled={profileSaving} style={{
                padding: '11px 20px', borderRadius: '10px', border: 'none',
                background: '#6366F1', color: '#fff', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}>
                <Save size={15} /> {profileSaving ? 'Saving...' : 'Update'}
              </button>
            </form>
            <MessageBox msg={profileMsg} />
          </div>

          {/* Change Dashboard Password */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>Dashboard Login Password</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B' }}>/login page ka password change karein</p>
              </div>
            </div>
            <form onSubmit={handlePassChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <PwInput value={passForm.current} onChange={e => setPassForm({ ...passForm, current: e.target.value })} placeholder="Current password" show={showCurrent} toggleShow={() => setShowCurrent(!showCurrent)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <PwInput value={passForm.newPass} onChange={e => setPassForm({ ...passForm, newPass: e.target.value })} placeholder="New password" show={showNew} toggleShow={() => setShowNew(!showNew)} />
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <PwInput value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} placeholder="Repeat password" show={showConfirm} toggleShow={() => setShowConfirm(!showConfirm)} />
                </div>
              </div>
              <button type="submit" disabled={passSaving} style={{
                padding: '12px', borderRadius: '10px', border: 'none',
                background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
              }}>
                <Lock size={16} /> {passSaving ? 'Changing...' : 'Change Dashboard Password'}
              </button>
            </form>
            <MessageBox msg={passMsg} />
          </div>

          {/* Change Ledger Passcode */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E8871E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>Homepage Ledger Passcode</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Public website pe entry karne ka passcode (abhi: namah108)</p>
              </div>
            </div>
            <form onSubmit={handleLedgerPassChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Current Passcode</label>
                <input type="text" value={ledgerPass.current} onChange={e => setLedgerPass({ ...ledgerPass, current: e.target.value })} placeholder="e.g. namah108" style={inputStyle} required
                  onFocus={e => e.target.style.borderColor = '#E8871E'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>New Passcode</label>
                  <input type="text" value={ledgerPass.newCode} onChange={e => setLedgerPass({ ...ledgerPass, newCode: e.target.value })} placeholder="New passcode" style={inputStyle} required
                    onFocus={e => e.target.style.borderColor = '#E8871E'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Passcode</label>
                  <input type="text" value={ledgerPass.confirm} onChange={e => setLedgerPass({ ...ledgerPass, confirm: e.target.value })} placeholder="Repeat passcode" style={inputStyle} required
                    onFocus={e => e.target.style.borderColor = '#E8871E'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>
              <button type="submit" disabled={ledgerSaving} style={{
                padding: '12px', borderRadius: '10px', border: 'none',
                background: '#E8871E', color: '#fff', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(232,135,30,0.3)'
              }}>
                <Shield size={16} /> {ledgerSaving ? 'Changing...' : 'Change Ledger Passcode'}
              </button>
            </form>
            <MessageBox msg={ledgerMsg} />
          </div>

        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
