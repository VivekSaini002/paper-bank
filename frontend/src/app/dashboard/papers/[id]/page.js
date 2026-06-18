'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { papersAPI, aiAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function PaperDetailPage({ params }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && id) fetchPaper();
  }, [user, authLoading, id]);

  const fetchPaper = async () => {
    try {
      const data = await papersAPI.getById(id);
      setPaper(data);
    } catch (err) {
      console.error('Failed to fetch paper:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await papersAPI.download(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.title}.${paper.fileType}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert('Download failed: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await aiAPI.analyzePaper(id);
      setAnalysis(result.analysis);
    } catch (err) {
      setAnalysis('Error: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (authLoading || loading) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: '40px', height: '40px' }} />
    </div>;
  }

  if (!paper) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 24px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</p>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Paper Not Found</h2>
          <button onClick={() => router.back()} className="btn-primary">← Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="btn-ghost"
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Back to Papers
        </button>

        {/* Paper Details Card */}
        <div className="glass-card animate-fade-in" style={{ padding: '36px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{paper.course}</span>
                <span className="badge badge-warning">Semester {paper.semester}</span>
                <span className="badge badge-primary">{paper.year}</span>
                {paper.examType && <span className="badge badge-success">{paper.examType}</span>}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>
                {paper.title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '8px' }}>
                📘 {paper.subjectName} ({paper.subjectCode})
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Uploaded by {paper.uploadedByName} • {paper.fileType.toUpperCase()} • {(paper.fileSize / 1024).toFixed(0)} KB
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownload}
              className="btn-primary"
              disabled={downloading}
              style={{ opacity: downloading ? 0.7 : 1 }}
            >
              {downloading ? (
                <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Downloading...</>
              ) : (
                '📥 Download Paper'
              )}
            </button>
            <button
              onClick={handleAnalyze}
              className="btn-secondary"
              disabled={analyzing}
              style={{ opacity: analyzing ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {analyzing ? (
                <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Analyzing...</>
              ) : (
                '✨ AI Generate Solutions'
              )}
            </button>
          </div>
        </div>

        {/* AI Analysis Result */}
        {(analyzing || analysis) && (
          <div className="glass-card animate-slide-up" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤖 AI-Generated Solutions
            </h2>
            {analyzing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                <div className="spinner" style={{ width: '36px', height: '36px', marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Analyzing paper and generating solutions...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>This may take a minute.</p>
              </div>
            ) : (
              <div className="markdown-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {analysis}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
