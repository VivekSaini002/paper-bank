'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { adminAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function AdminStudentsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin()) {
        router.push('/login');
        return;
      }
      fetchStudents();
    }
  }, [user, authLoading]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getStudents();
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError(err.message || 'Failed to load students directory.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      (student.fullName && student.fullName.toLowerCase().includes(query)) ||
      (student.email && student.email.toLowerCase().includes(query)) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(query)) ||
      (student.course && student.course.toLowerCase().includes(query))
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
              👨‍🎓 Student Directory
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              View and manage registered students and their details.
            </p>
          </div>
          
          {/* Search bar */}
          <div style={{ width: '100%', maxWidth: '400px', marginTop: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Search by name, email, roll no, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            padding: '16px 20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            marginBottom: '24px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Directory Card */}
        <div className="glass-card animate-fade-in" style={{ padding: '4px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Full Name</th>
                <th style={thStyle}>Email Address</th>
                <th style={thStyle}>Course</th>
                <th style={thStyle}>Roll Number</th>
                <th style={thStyle}>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {searchQuery ? 'No registered students match your search criteria.' : 'No registered students found.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={tdStyle}><span style={{ color: 'var(--text-muted)' }}>#{student.id}</span></td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{student.fullName}</span>
                    </td>
                    <td style={tdStyle}>{student.email}</td>
                    <td style={tdStyle}>
                      {student.course ? (
                        <span className="badge badge-primary">{student.course}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not Specified</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {student.rollNo ? (
                        <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                          {student.rollNo}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={tdStyle}>{formatDate(student.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
};
