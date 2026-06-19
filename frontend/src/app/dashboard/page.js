'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { papersAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchRecentPapers();
  }, [user, authLoading]);

  const fetchRecentPapers = async () => {
    try {
      const data = await papersAPI.getAll(0, 6, 'createdAt', 'desc');
      setPapers(data.content || []);
    } catch (err) {
      console.error('Failed to fetch papers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: '40px', height: '40px' }} />
    </div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Welcome Header */}
        <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            Welcome back, <span style={{ color: 'var(--primary-light)' }}>{user.fullName}!</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Ready to prepare for your exams? Browse question papers or ask our AI assistant.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '48px',
        }}>
          <Link href="/dashboard/papers" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '28px', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📄</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>Browse Papers</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Search and filter question papers by course, semester, and year.
              </p>
            </div>
          </Link>

          <Link href="/ai" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '28px', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🤖</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>AI Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Ask any question and get instant answers from our AI tutor.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/profile" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '28px', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>Your Profile</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {user.course || 'Not specified'} • Roll: {user.rollNo || 'N/A'}
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Papers */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Recent Papers</h2>
            <Link href="/dashboard/papers" className="btn-ghost" style={{ textDecoration: 'none', color: 'var(--primary-light)' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: '200px' }} />
              ))}
            </div>
          ) : papers.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No papers uploaded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {papers.map(paper => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PaperCard({ paper }) {
  const fileIcon = paper.fileType === 'pdf' ? '📕' : '🖼️';

  return (
    <Link href={`/dashboard/papers/${paper.id}`} style={{ textDecoration: 'none' }}>
      <div className="glass-card" style={{ padding: '24px', cursor: 'pointer', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <span style={{ fontSize: '2rem' }}>{fileIcon}</span>
          <span className="badge badge-primary">{paper.year}</span>
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', lineHeight: '1.4' }}>
          {paper.title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
          {paper.subjectName} ({paper.subjectCode})
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{paper.course}</span>
          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Sem {paper.semester}</span>
          {paper.examType && (
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{paper.examType}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
