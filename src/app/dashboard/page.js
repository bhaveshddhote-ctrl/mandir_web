'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, IndianRupee, List,
  ArrowUpRight, ArrowDownRight, Clock, RefreshCw
} from 'lucide-react';

const cardStyle = {
  background: 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(212,96,26,0.12)',
  borderRadius: '16px',
  padding: '24px',
};

const StatCard = ({ title, value, icon: Icon, color, sub }) => (
  <div style={{ ...cardStyle, flex: '1', minWidth: '200px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: `${color}18`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={22} />
      </div>
      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{sub}</span>
    </div>
    <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '6px' }}>{title}</p>
    <h3 style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#1E293B' }}>₹{value}</h3>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({ donations: '0', expenses: '0', balance: '0', entries: 0 });
  const [chartData, setChartData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || {});
        setChartData(data.chartData?.length ? data.chartData : [
          { name: 'Jan', donations: 0, expenses: 0 },
          { name: 'Feb', donations: 0, expenses: 0 },
          { name: 'Mar', donations: 0, expenses: 0 },
        ]);
        setActivity(data.activity || []);
        setLastRefresh(new Date().toLocaleTimeString('en-IN'));
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const balance = parseInt((stats.balance || '0').replace(/,/g, ''));

  return (
    <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Trustee', 'Member']}>
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>
                🕉️ Mandir Dashboard
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Real-time financial overview — Shri Guru Gorakhnath Math, Nimanwada
              </p>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                backgroundColor: '#D4601A', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
              }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {lastRefresh && (
            <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '-16px' }}>
              Last updated: {lastRefresh}
            </p>
          )}

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <StatCard
              title="Total Donations (Aay)"
              value={stats.donations}
              icon={TrendingUp}
              color="#16A34A"
              sub="Income"
            />
            <StatCard
              title="Total Expenses (Vyay)"
              value={stats.expenses}
              icon={TrendingDown}
              color="#DC2626"
              sub="Spent"
            />
            <StatCard
              title="Current Balance (Shesh)"
              value={stats.balance}
              icon={IndianRupee}
              color={balance >= 0 ? '#D4601A' : '#DC2626'}
              sub="Balance"
            />
            <div style={{ ...cardStyle, flex: '1', minWidth: '200px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: '#6366F118', color: '#6366F1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
              }}>
                <List size={22} />
              </div>
              <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '6px' }}>Total Entries</p>
              <h3 style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#1E293B' }}>{stats.entries}</h3>
            </div>
          </div>

          {/* Chart + Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            
            {/* Area Chart */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B' }}>📊 Financial Trends</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }}></span>
                    Donations
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block' }}></span>
                    Expenses
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gDonations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.82rem' }}
                      formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                    />
                    <Area type="monotone" dataKey="donations" stroke="#16A34A" strokeWidth={2.5} fillOpacity={1} fill="url(#gDonations)" />
                    <Area type="monotone" dataKey="expenses" stroke="#DC2626" strokeWidth={2.5} fillOpacity={1} fill="url(#gExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', marginBottom: '20px' }}>🕐 Recent Entries</h3>
              {activity.length === 0 ? (
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', textAlign: 'center', paddingTop: '40px' }}>
                  No entries yet.<br />Add from homepage ledger section.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activity.map((item, i) => (
                    <div key={item.id || i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                        backgroundColor: item.type === 'donation' ? '#16A34A18' : '#DC262618',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: item.type === 'donation' ? '#16A34A' : '#DC2626'
                      }}>
                        {item.type === 'donation' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ fontWeight: '600', fontSize: '0.82rem', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.user}
                          </p>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                            <Clock size={10} /> {item.time}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.type === 'donation' ? '+' : '−'}₹{item.amount} — {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <a
                href="/"
                style={{
                  display: 'block', textAlign: 'center', marginTop: '24px',
                  padding: '10px', borderRadius: '10px',
                  backgroundColor: '#FFF7F0', color: '#D4601A',
                  fontSize: '0.82rem', fontWeight: '600', textDecoration: 'none',
                  border: '1px solid #D4601A30'
                }}
              >
                ➕ Add Entry on Homepage
              </a>
            </div>
          </div>

          {/* Quick Help Card */}
          <div style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #4A0E18, #6E1423)',
            color: '#F4E9D6',
            border: 'none'
          }}>
            <h3 style={{ color: '#E8871E', marginBottom: '12px', fontSize: '1rem', fontWeight: '700' }}>
              🔥 Management Guide — Entries Kaise Karein?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ fontWeight: '700', marginBottom: '4px', fontSize: '0.85rem', color: '#E8871E' }}>Step 1</p>
                <p style={{ fontSize: '0.82rem', color: '#EADFC7' }}>Homepage → आय-व्यय section pe scroll karo</p>
              </div>
              <div>
                <p style={{ fontWeight: '700', marginBottom: '4px', fontSize: '0.85rem', color: '#E8871E' }}>Step 2</p>
                <p style={{ fontSize: '0.82rem', color: '#EADFC7' }}>"🔒 एंट्री जोड़ें" click karo</p>
              </div>
              <div>
                <p style={{ fontWeight: '700', marginBottom: '4px', fontSize: '0.85rem', color: '#E8871E' }}>Step 3</p>
                <p style={{ fontSize: '0.82rem', color: '#EADFC7' }}>Passcode: <strong style={{ color: '#fff' }}>namah108</strong></p>
              </div>
              <div>
                <p style={{ fontWeight: '700', marginBottom: '4px', fontSize: '0.85rem', color: '#E8871E' }}>Step 4</p>
                <p style={{ fontSize: '0.82rem', color: '#EADFC7' }}>Date, Type, Amount, Description bharo → Save!</p>
              </div>
            </div>
          </div>

        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @media (max-width: 768px) {
            .dashboard-chart-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </DashboardLayout>
    </RoleGuard>
  );
}
