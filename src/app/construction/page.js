'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import { Construction, CheckCircle2, AlertCircle, Clock, Plus, Trash2, Edit2, X, RefreshCw } from 'lucide-react';

const cardStyle = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const { id, title, progress, budget, spent, status, date } = project;

  return (
    <div style={{
      ...cardStyle,
      borderLeft: `4px solid ${status === 'Completed' || status === 'On Track' ? '#16A34A' : status === 'Delayed' ? '#EF4444' : '#F59E0B'}`,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>{title}</h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> Est. Completion: {date}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            padding: '4px 10px', 
            borderRadius: '100px', 
            fontSize: '0.75rem', 
            fontWeight: 700,
            backgroundColor: status === 'Completed' || status === 'On Track' ? '#DCFCE7' : status === 'Delayed' ? '#FEE2E2' : '#FEF3C7',
            color: status === 'Completed' || status === 'On Track' ? '#16A34A' : status === 'Delayed' ? '#EF4444' : '#D97706'
          }}>
            {status}
          </span>
          <button onClick={() => onEdit(project)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#64748B' }}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#EF4444' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Overall Progress</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>{progress}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, Math.max(0, progress))}%`, height: '100%', backgroundColor: '#D4601A', borderRadius: '100px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
        <div>
          <p style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Allocated Budget</p>
          <p style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>₹{budget.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Total Spent</p>
          <p style={{ fontWeight: 800, color: spent > budget ? '#EF4444' : '#16A34A', fontSize: '0.95rem' }}>₹{spent.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default function ConstructionPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProj, setEditingProj] = useState(null);

  const [form, setForm] = useState({
    title: '',
    budget: '',
    spent: '',
    progress: 0,
    status: 'On Track',
    date: '',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/construction');
      if (res.ok) setProjects(await res.json());
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProj(null);
    setForm({ title: '', budget: '', spent: '', progress: 0, status: 'On Track', date: 'Oct 2024' });
    setShowModal(true);
  };

  const openEditModal = (proj) => {
    setEditingProj(proj);
    setForm({
      title: proj.title,
      budget: proj.budget,
      spent: proj.spent,
      progress: proj.progress,
      status: proj.status,
      date: proj.date
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.budget) return;

    try {
      const url = editingProj ? `/api/construction/${editingProj.id}` : '/api/construction';
      const method = editingProj ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setShowModal(false);
        fetchProjects();
      }
    } catch (err) {
      alert('Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Is construction project ko delete karna chahte hain?')) return;
    try {
      const res = await fetch(`/api/construction/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Calculations
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const totalSpent = projects.reduce((s, p) => s + (p.spent || 0), 0);
  const overallPercent = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0';

  const finishedCount = projects.filter(p => p.status === 'Completed').length;
  const ongoingCount = projects.filter(p => p.status === 'On Track' || p.status === 'In Progress').length;
  const criticalCount = projects.filter(p => p.status === 'Delayed').length;

  return (
    <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Trustee', 'Member']}>
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>
                🏗️ Construction Works
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Monitoring infrastructure development and budget utilization in real-time.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={fetchProjects} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', borderRadius: '10px',
                border: '1px solid #E2E8F0', background: '#fff', color: '#64748B',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
              }}>
                <RefreshCw size={15} /> Refresh
              </button>
              <button onClick={openAddModal} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '10px',
                backgroundColor: '#D4601A', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(212,96,26,0.3)'
              }}>
                <Plus size={18} /> New Project
              </button>
            </div>
          </div>

          {/* Grid of Projects */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Loading Construction Projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
              <Construction size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
              <p style={{ fontWeight: 600, color: '#64748B' }}>Koi project available nahi hai</p>
              <p style={{ fontSize: '0.85rem' }}>Upar "New Project" button se add karo</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} onDelete={handleDelete} onEdit={openEditModal} />
              ))}
            </div>
          )}

          {/* Budget Analysis Overview */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1E293B', marginBottom: '20px' }}>
              📊 Realtime Budget Analysis Overview
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
              <div style={{ flex: '1', minWidth: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Total Construction Budget</span>
                  <span style={{ fontWeight: '800', color: '#D4601A', fontSize: '1rem' }}>₹{totalBudget.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Number(overallPercent))}%`, height: '100%', backgroundColor: '#D4601A', borderRadius: '100px', transition: 'width 0.4s ease' }} />
                </div>
                <p style={{ marginTop: '10px', fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
                  ₹{totalSpent.toLocaleString('en-IN')} spent of ₹{totalBudget.toLocaleString('en-IN')} ({overallPercent}%)
                </p>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 8px', color: '#16A34A' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <p style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E293B' }}>{finishedCount}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Finished</p>
                </div>
                <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 8px', color: '#D97706' }}>
                    <Construction size={22} />
                  </div>
                  <p style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E293B' }}>{ongoingCount}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Ongoing</p>
                </div>
                <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 8px', color: '#EF4444' }}>
                    <AlertCircle size={22} />
                  </div>
                  <p style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E293B' }}>{criticalCount}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Critical / Delayed</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal for Add / Edit */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1E293B' }}>
                  {editingProj ? '✏️ Edit Project' : '➕ New Construction Project'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Project Title *</label>
                  <input type="text" placeholder="e.g. Pilgrims Dining Hall" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Budget (₹) *</label>
                    <input type="number" placeholder="1500000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Spent (₹)</label>
                    <input type="number" placeholder="500000" value={form.spent} onChange={e => setForm({ ...form, spent: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Progress (%)</label>
                    <input type="number" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem', background: '#fff', boxSizing: 'border-box' }}>
                      <option value="On Track">On Track</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Completion Date</label>
                  <input type="text" placeholder="e.g. Dec 2025" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: '#D4601A', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212,96,26,0.3)' }}>
                    {editingProj ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </DashboardLayout>
    </RoleGuard>
  );
}
