'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { papersAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

const COURSES = ['B.Tech', 'BCA', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'BA', 'MA'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function PapersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [years, setYears] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchYears();
      fetchPapers();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchPapers();
  }, [currentPage, sortBy, direction]);

  const fetchYears = async () => {
    try {
      const data = await papersAPI.getYears();
      setYears(data);
    } catch (err) {
      console.error('Failed to fetch years:', err);
    }
  };

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const data = await papersAPI.search({
        course: course || undefined,
        semester: semester || undefined,
        year: year || undefined,
        keyword: keyword || undefined,
        page: currentPage,
        size: 12,
        sortBy,
        direction,
      });
      setPapers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPapers();
  };

  const handleReset = () => {
    setKeyword('');
    setCourse('');
    setSemester('');
    setYear('');
    setSortBy('createdAt');
    setDirection('desc');
    setCurrentPage(0);
    setTimeout(fetchPapers, 0);
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
        <div className="animate-fade-in">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            📄 Question Papers
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Browse, search, and download previous year question papers.
          </p>
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          {/* Search Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Search by title, subject, or code..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Search
            </button>
          </div>

          {/* Filter Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'end' }}>
            <div>
              <label className="form-label">Course</label>
              <select className="select-field" value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="">All Courses</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Semester</label>
              <select className="select-field" value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Year</label>
              <select className="select-field" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Sort By</label>
              <select className="select-field" value={`${sortBy}-${direction}`} onChange={(e) => {
                const [s, d] = e.target.value.split('-');
                setSortBy(s);
                setDirection(d);
              }}>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="year-desc">Year (Newest)</option>
                <option value="year-asc">Year (Oldest)</option>
                <option value="subjectName-asc">Subject (A-Z)</option>
              </select>
            </div>
            <button type="button" onClick={handleReset} className="btn-ghost" style={{ height: '44px' }}>
              ↺ Reset
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ height: '220px' }} />
            ))}
          </div>
        ) : papers.length === 0 ? (
          <div className="glass-card" style={{ padding: '80px', textAlign: 'center' }}>
            <p style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</p>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '8px' }}>No papers found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {papers.map(paper => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px',
              }}>
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  style={{ opacity: currentPage === 0 ? 0.5 : 1, padding: '10px 18px' }}
                >
                  ← Prev
                </button>
                <span style={{
                  display: 'flex', alignItems: 'center', padding: '0 16px',
                  color: 'var(--text-secondary)', fontSize: '0.9rem',
                }}>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  style={{ opacity: currentPage >= totalPages - 1 ? 0.5 : 1, padding: '10px 18px' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function PaperCard({ paper }) {
  const fileIcon = paper.fileType === 'pdf' ? '📕' : '🖼️';
  const sizeKB = paper.fileSize ? (paper.fileSize / 1024).toFixed(0) : '?';

  return (
    <Link href={`/dashboard/papers/${paper.id}`} style={{ textDecoration: 'none' }}>
      <div className="glass-card" style={{ padding: '24px', cursor: 'pointer', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <span style={{ fontSize: '2rem' }}>{fileIcon}</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="badge badge-primary">{paper.year}</span>
          </div>
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', lineHeight: '1.4' }}>
          {paper.title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px' }}>
          {paper.subjectName} ({paper.subjectCode})
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px' }}>
          {paper.fileType.toUpperCase()} • {sizeKB} KB
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{paper.course}</span>
          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Sem {paper.semester}</span>
          {paper.examType && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{paper.examType}</span>}
        </div>
      </div>
    </Link>
  );
}
