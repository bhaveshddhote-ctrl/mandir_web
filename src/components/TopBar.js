'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

const pageNames = {
  '/dashboard': '🕉️ Dashboard',
  '/finance/donations': '🙏 Donations (Daan)',
  '/finance/expenses': '💸 Expenses (Vyay)',
  '/gallery': '🖼️ Gallery Management',
  '/dashboard/content': '🌐 Website Content Manager',
  '/construction': '🏗️ Construction',
  '/dashboard/settings': '⚙️ Settings',
};

const TopBar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const pageName = pageNames[pathname] || 'Dashboard';

  return (
    <header style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      background: '#fff',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      gap: '16px',
    }}>

      {/* Page Title (left) */}
      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', whiteSpace: 'nowrap' }}>
        {pageName}
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#F1F5F9', borderRadius: '10px',
          padding: '8px 14px', gap: '8px',
          border: '1px solid #E2E8F0',
        }}>
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: '0.85rem', color: '#374151', width: '160px',
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: '#F1F5F9', border: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', color: '#64748B',
        }}>
          <Bell size={17} />
          <span style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '7px', height: '7px',
            background: '#EF4444', borderRadius: '50%',
            border: '1.5px solid #fff',
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '32px', background: '#E2E8F0' }} />

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.3 }}>
              {user?.name || 'Mandir Admin'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#E8871E', fontWeight: 600 }}>
              {user?.role || 'Super Admin'}
            </div>
          </div>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8871E, #C1652F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '0.9rem',
            boxShadow: '0 4px 10px rgba(232,135,30,0.3)',
            flexShrink: 0,
          }}>
            {(user?.name || 'A')[0].toUpperCase()}
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopBar;
