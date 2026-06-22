'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { adminAPI, papersAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentPapers, setRecentPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin()) {
        router.push('/login');
        return;
      }
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [statsData, papersData] = await Promise.all([
        adminAPI.getStats(),
        papersAPI.getAll(0, 5, 'createdAt', 'desc'),
      ]);
      setStats(statsData);
      setRecentPapers(papersData.content || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
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

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Manage papers, monitor activity, and maintain the platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <StatCard
            icon="📄"
            label="Total Papers"
            value={stats?.totalPapers || 0}
            gradient="linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))"
          />
          <StatCard
            icon="👨‍🎓"
            label="Students"
            value={stats?.totalStudents || 0}
            gradient="linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))"
          />
          <StatCard
            icon="👑"
            label="Admins"
            value={stats?.totalAdmins || 0}
            gradient="linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.08))"
          />
          <StatCard
            icon="📚"
            label="Courses"
            value={stats?.courses?.length || 0}
            gradient="linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.08))"
          />
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <Link href="/admin/upload" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '28px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📤</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>Upload Paper</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Add new question papers</p>
            </div>
          </Link>
          <Link href="/admin/manage" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '28px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚙️</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>Manage Papers</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Edit, update, or delete</p>
            </div>
          </Link>
          <Link href="/admin/students" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '28px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👨‍🎓</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>Manage Students</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>View student directory</p>
            </div>
          </Link>
          <Link href="/ai" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '28px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🤖</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>AI Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Generate solutions</p>
            </div>
          </Link>
        </div>

        {/* Recent Papers */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
            Recent Uploads
          </h2>
          {recentPapers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              No papers uploaded yet. Start by uploading your first paper.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Subject</th>
                    <th style={thStyle}>Course</th>
                    <th style={thStyle}>Sem</th>
                    <th style={thStyle}>Year</th>
                    <th style={thStyle}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPapers.map(paper => (
                    <tr key={paper.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{paper.title}</td>
                      <td style={tdStyle}>{paper.subjectName}</td>
                      <td style={tdStyle}><span className="badge badge-primary">{paper.course}</span></td>
                      <td style={tdStyle}>{paper.semester}</td>
                      <td style={tdStyle}>{paper.year}</td>
                      <td style={tdStyle}>{paper.fileType.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="glass-card" style={{ padding: '24px', background: gradient }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>{label}</p>
          <p style={{ fontSize: '2rem', fontWeight: '800' }}>{value}</p>
        </div>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
};
