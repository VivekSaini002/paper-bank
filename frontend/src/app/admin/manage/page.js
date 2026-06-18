'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { papersAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

const COURSES = ['B.Tech', 'BCA', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'BA', 'MA'];

export default function ManagePapersPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/login');
      return;
    }
    if (user) fetchPapers();
  }, [user, authLoading, currentPage]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const data = await papersAPI.getAll(currentPage, 10, 'createdAt', 'desc');
      setPapers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (paper) => {
    setEditingId(paper.id);
    setEditForm({
      title: paper.title,
      subjectName: paper.subjectName,
      subjectCode: paper.subjectCode,
      course: paper.course,
      semester: paper.semester,
      year: paper.year,
      examType: paper.examType || '',
    });
  };

  const handleSave = async (id) => {
    try {
      await papersAPI.update(id, editForm);
      setEditingId(null);
      fetchPapers();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this paper? This action cannot be undone.')) return;
    setDeleting(id);
    try {
      await papersAPI.delete(id);
      fetchPapers();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || loading) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: '40px', height: '40px' }} />
    </div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            ⚙️ Manage Papers
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Edit, update, or delete question papers.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '4px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Course</th>
                <th style={thStyle}>Sem</th>
                <th style={thStyle}>Year</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {papers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No papers found.
                  </td>
                </tr>
              ) : (
                papers.map(paper => (
                  <tr key={paper.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    {editingId === paper.id ? (
                      <>
                        <td style={tdStyle}>
                          <input className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                        </td>
                        <td style={tdStyle}>
                          <input className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={editForm.subjectName} onChange={(e) => setEditForm({ ...editForm, subjectName: e.target.value })} />
                        </td>
                        <td style={tdStyle}>
                          <input className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem', width: '80px' }}
                            value={editForm.subjectCode} onChange={(e) => setEditForm({ ...editForm, subjectCode: e.target.value })} />
                        </td>
                        <td style={tdStyle}>
                          <select className="select-field" style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={editForm.course} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}>
                            {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <input type="number" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem', width: '60px' }}
                            value={editForm.semester} min="1" max="8"
                            onChange={(e) => setEditForm({ ...editForm, semester: parseInt(e.target.value) })} />
                        </td>
                        <td style={tdStyle}>
                          <input type="number" className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem', width: '80px' }}
                            value={editForm.year}
                            onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })} />
                        </td>
                        <td style={tdStyle}>
                          <input className="input-field" style={{ padding: '6px 10px', fontSize: '0.85rem', width: '90px' }}
                            value={editForm.examType} onChange={(e) => setEditForm({ ...editForm, examType: e.target.value })} />
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleSave(paper.id)} className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Save</button>
                            <button onClick={() => setEditingId(null)} className="btn-ghost"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={tdStyle}>{paper.title}</td>
                        <td style={tdStyle}>{paper.subjectName}</td>
                        <td style={tdStyle}><span className="badge badge-primary">{paper.subjectCode}</span></td>
                        <td style={tdStyle}>{paper.course}</td>
                        <td style={tdStyle}>{paper.semester}</td>
                        <td style={tdStyle}>{paper.year}</td>
                        <td style={tdStyle}>{paper.examType || '—'}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleEdit(paper)} className="btn-ghost"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--primary-light)' }}>✏️ Edit</button>
                            <button
                              onClick={() => handleDelete(paper.id)}
                              className="btn-ghost"
                              disabled={deleting === paper.id}
                              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f87171' }}
                            >
                              {deleting === paper.id ? '...' : '🗑️ Delete'}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
            <button className="btn-secondary" onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0} style={{ opacity: currentPage === 0 ? 0.5 : 1, padding: '10px 18px' }}>
              ← Prev
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--text-secondary)' }}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button className="btn-secondary" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1} style={{ opacity: currentPage >= totalPages - 1 ? 0.5 : 1, padding: '10px 18px' }}>
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const thStyle = {
  textAlign: 'left', padding: '14px 12px', fontSize: '0.75rem', fontWeight: '600',
  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)',
};
