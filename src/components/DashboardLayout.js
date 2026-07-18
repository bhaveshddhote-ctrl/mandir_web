'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useState } from 'react';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9' }}>

      {/* Sidebar — pass state down */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content — shifts with sidebar */}
      <div style={{
        marginLeft: `${sidebarWidth}px`,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
        minWidth: 0,
      }}>

        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '24px 28px 40px',
          overflowX: 'hidden',
        }}>
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
