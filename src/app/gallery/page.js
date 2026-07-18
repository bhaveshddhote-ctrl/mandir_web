'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import {
  Upload, Trash2, Eye, EyeOff, RefreshCw,
  CheckCircle, AlertCircle, ImageIcon, X, GripVertical
} from 'lucide-react';

const cardStyle = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export default function GalleryManagementPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', caption: '' });
  const [preview, setPreview] = useState(null); // {url, title}

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) setImages(await res.json());
    } catch (e) {
      showToast('error', 'Gallery load nahi ho rahi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Sirf image files allowed hain');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File 5MB se chhoti honi chahiye');
      return;
    }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = e => setUploadPreview(e.target.result);
    reader.readAsDataURL(file);
    if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      showToast('error', 'Pehle image select karo');
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', uploadFile);
      form.append('title', uploadTitle || 'Gallery Image');
      form.append('caption', uploadCaption);

      const res = await fetch('/api/gallery', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadFile(null);
        setUploadPreview(null);
        setUploadTitle('');
        setUploadCaption('');
        await fetchImages();
        showToast('success', '✅ Image uploaded aur gallery mein add ho gayi!');
      } else {
        showToast('error', '❌ ' + (data.error || 'Upload failed'));
      }
    } catch (e) {
      showToast('error', '❌ Network error. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async (id, currentVisible) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      });
      if (res.ok) {
        setImages(prev => prev.map(img => img.id === id ? { ...img, visible: !currentVisible } : img));
        showToast('success', !currentVisible ? '👁️ Public website pe dikhai degi' : '🙈 Public website se hatayi gayi');
      }
    } catch {
      showToast('error', 'Update failed');
    }
  };

  const deleteImage = async (id, title) => {
    if (!confirm(`"${title}" ko permanently delete karna chahte hain?`)) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        showToast('success', '🗑️ Image delete ho gayi');
      }
    } catch {
      showToast('error', 'Delete failed');
    }
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editForm.title, caption: editForm.caption }),
      });
      if (res.ok) {
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...editForm } : img));
        setEditingId(null);
        showToast('success', '✅ Updated!');
      }
    } catch {
      showToast('error', 'Update failed');
    }
  };

  const visibleCount = images.filter(i => i.visible).length;

  return (
    <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>
                🖼️ Gallery Management
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Images upload karo aur control karo kaunsi public website pe dikhe
              </p>
            </div>
            <button onClick={fetchImages} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '10px',
              border: '1px solid #E2E8F0', background: '#fff', color: '#64748B',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
            }}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Images', value: images.length, color: '#6366F1' },
              { label: 'Public Pe Dikha Rahe', value: visibleCount, color: '#16A34A' },
              { label: 'Hidden (Admin Only)', value: images.length - visibleCount, color: '#94A3B8' },
            ].map(s => (
              <div key={s.label} style={{ ...cardStyle, padding: '16px 22px', borderLeft: `4px solid ${s.color}`, flex: 1, minWidth: '160px' }}>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Upload Section */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} color="#6366F1" /> Nayi Image Upload Karo
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? '#6366F1' : '#CBD5E1'}`,
                  borderRadius: '12px',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: dragOver ? '#EEF2FF' : '#F8FAFC',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {uploadPreview ? (
                  <>
                    <img src={uploadPreview} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} />
                    <button onClick={e => { e.stopPropagation(); setUploadFile(null); setUploadPreview(null); }} style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                      width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff'
                    }}>
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon size={36} color="#94A3B8" style={{ marginBottom: '12px' }} />
                    <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
                      Image yahan drag karo<br />ya click karke select karo
                    </p>
                    <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '6px' }}>JPG, PNG, WebP — max 5MB</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelect(e.target.files[0])} />
              </div>

              {/* Title, caption, upload button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Image Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Akhand Dhuni, Mandir Pravesh"
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Caption (Optional)</label>
                  <textarea
                    placeholder="Short description — public website pe dikh sakti hai"
                    value={uploadCaption}
                    onChange={e => setUploadCaption(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !uploadFile}
                  style={{
                    padding: '12px', borderRadius: '10px', border: 'none',
                    background: !uploadFile ? '#E2E8F0' : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                    color: !uploadFile ? '#94A3B8' : '#fff',
                    fontWeight: 700, cursor: !uploadFile ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontSize: '0.9rem',
                    boxShadow: uploadFile ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Upload size={17} />
                  {uploading ? 'Uploading...' : 'Upload & Gallery Mein Add Karo'}
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} color="#E8871E" /> Saari Images — Visibility Control
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748B' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} /> Visible on public site
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94A3B8', display: 'inline-block', marginLeft: '8px' }} /> Hidden
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
                <RefreshCw size={28} style={{ margin: '0 auto 12px', display: 'block' }} />
                Loading gallery...
              </div>
            ) : images.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                <ImageIcon size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }} />
                <p style={{ fontWeight: 600, marginBottom: '6px', color: '#64748B' }}>Abhi koi image nahi hai</p>
                <p style={{ fontSize: '0.85rem' }}>Upar "Upload" section se apni pehli image add karo</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
              }}>
                {images.map((img) => (
                  <div key={img.id} style={{
                    border: `2px solid ${img.visible ? '#BBF7D0' : '#E2E8F0'}`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#fff',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}>
                    {/* Image */}
                    <div style={{ position: 'relative', height: '160px', background: '#F1F5F9', cursor: 'pointer' }}
                      onClick={() => setPreview({ url: img.url, title: img.title })}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#94A3B8' }}>
                        <ImageIcon size={32} />
                        <span style={{ fontSize: '0.75rem' }}>Preview unavailable</span>
                      </div>

                      {/* Visibility badge */}
                      <div style={{
                        position: 'absolute', top: '8px', left: '8px',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                        background: img.visible ? '#16A34A' : '#94A3B8',
                        color: '#fff',
                      }}>
                        {img.visible ? '👁️ Public' : '🙈 Hidden'}
                      </div>
                    </div>

                    {/* Info + Controls */}
                    <div style={{ padding: '12px' }}>
                      {editingId === img.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.82rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                          <input value={editForm.caption} onChange={e => setEditForm({ ...editForm, caption: e.target.value })}
                            placeholder="Caption..."
                            style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.78rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => saveEdit(img.id)} style={{ flex: 1, padding: '6px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Save</button>
                            <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '6px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '7px', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {img.title}
                          </p>
                          {img.caption && <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.caption}</p>}

                          <div style={{ display: 'flex', gap: '6px', marginTop: img.caption ? '0' : '10px' }}>
                            {/* Toggle Visibility */}
                            <button
                              onClick={() => toggleVisibility(img.id, img.visible)}
                              title={img.visible ? 'Public se chhupao' : 'Public pe dikhaao'}
                              style={{
                                flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none',
                                background: img.visible ? '#DCFCE7' : '#F1F5F9',
                                color: img.visible ? '#16A34A' : '#64748B',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                fontSize: '0.72rem', fontWeight: 700,
                              }}
                            >
                              {img.visible ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => { setEditingId(img.id); setEditForm({ title: img.title, caption: img.caption || '' }); }}
                              style={{ padding: '7px 10px', borderRadius: '8px', border: 'none', background: '#EEF2FF', color: '#6366F1', cursor: 'pointer' }}
                            >
                              ✏️
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteImage(img.id, img.title)}
                              style={{ padding: '7px 10px', borderRadius: '8px', border: 'none', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lightbox Preview */}
        {preview && (
          <div onClick={() => setPreview(null)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <div style={{ maxWidth: '80vw', maxHeight: '85vh', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <img src={preview.url} alt={preview.title} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' }} />
              <p style={{ textAlign: 'center', color: '#fff', marginTop: '12px', fontWeight: 600 }}>{preview.title}</p>
              <button onClick={() => setPreview(null)} style={{
                position: 'absolute', top: '-16px', right: '-16px',
                background: '#fff', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

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
