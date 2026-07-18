'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  HandHeart,
  Receipt,
  Construction,
  Settings,
  Image,
  Globe,
  LogOut,
  ChevronLeft,
  Menu,
  Home,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Super Admin', 'Admin', 'Trustee', 'Member'] },
  { name: 'Donations (Daan)', icon: HandHeart, path: '/finance/donations', roles: ['Super Admin', 'Admin', 'Trustee'] },
  { name: 'Expenses (Vyay)', icon: Receipt, path: '/finance/expenses', roles: ['Super Admin', 'Admin', 'Trustee'] },
  { name: 'Gallery', icon: Image, path: '/gallery', roles: ['Super Admin', 'Admin'] },
  { name: 'Website Content', icon: Globe, path: '/dashboard/content', roles: ['Super Admin', 'Admin'] },
  { name: 'Construction', icon: Construction, path: '/construction', roles: ['Super Admin', 'Admin', 'Trustee', 'Member'] },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings', roles: ['Super Admin', 'Admin'] },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredItems = menuItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );

  const w = collapsed ? 72 : 240;

  return (
    <aside style={{
      width: `${w}px`,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0F172A 0%, #1a2540 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 50,
      transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
      overflowX: 'hidden',
      overflowY: 'auto',
      borderRight: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* Logo + Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        minHeight: '64px',
        overflow: 'hidden',
      }}>
        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#E8871E', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.3px' }}>
              Guru Gorakhnath
            </div>
            <div style={{ color: '#64748B', fontSize: '0.68rem', marginTop: '2px' }}>Management System</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94A3B8',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          {collapsed ? <Menu size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
              <div
                title={collapsed ? item.name : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? 0 : '11px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '11px 0' : '11px 14px',
                  borderRadius: '10px',
                  background: isActive
                    ? 'linear-gradient(135deg, #E8871E, #C1652F)'
                    : 'transparent',
                  color: isActive ? '#fff' : '#94A3B8',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(232,135,30,0.35)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  if (!isActive) e.currentTarget.style.color = '#E2E8F0';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                  if (!isActive) e.currentTarget.style.color = '#94A3B8';
                }}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500 }}>
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '8px 8px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Public Website link */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div
            title={collapsed ? 'Public Website' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: collapsed ? 0 : '11px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px 0' : '10px 14px',
              borderRadius: '10px',
              color: '#E8871E',
              cursor: 'pointer',
              border: '1px solid rgba(232,135,30,0.2)',
              marginBottom: '6px',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,135,30,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Home size={19} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Public Website</span>}
          </div>
        </Link>

        {/* User info (only when expanded) */}
        {!collapsed && user && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8871E, #C1652F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.82rem', fontWeight: 800, flexShrink: 0,
            }}>
              {(user.name || 'A')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#E2E8F0', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name || 'Admin'}
              </div>
              <div style={{ color: '#E8871E', fontSize: '0.7rem' }}>{user.role}</div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : ''}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : '11px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
            padding: collapsed ? '10px 0' : '10px 14px',
            borderRadius: '10px',
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <LogOut size={19} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
