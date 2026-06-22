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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBlob, setPreviewBlob] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && id) {
      fetchPaper();
      loadPreview();
    }
  }, [user, authLoading, id]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  const loadPreview = async () => {
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const blob = await papersAPI.download(id);
      setPreviewBlob(blob);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Failed to load preview:', err);
      setPreviewError('Failed to load paper preview.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let blob = previewBlob;
      let url = previewUrl;
      let shouldRevoke = false;
      
      if (!blob) {
        blob = await papersAPI.download(id);
        url = window.URL.createObjectURL(blob);
        shouldRevoke = true;
      }
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.title}.${paper.fileType}`;
      document.body.appendChild(a);
      a.click();
      if (shouldRevoke) {
        window.URL.revokeObjectURL(url);
      }
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

        {/* Paper Preview Card */}
        <div className="glass-card animate-fade-in" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              📄 Exam Paper Preview
            </h2>
            {previewUrl && (
              <button
                onClick={handleDownload}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '8px 16px' }}
              >
                📥 Download Original
              </button>
            )}
          </div>

          {previewLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading paper preview...</p>
            </div>
          ) : previewError ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>⚠️</span>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{previewError}</p>
              <button onClick={loadPreview} className="btn-secondary" style={{ padding: '8px 16px' }}>
                🔄 Retry Preview
              </button>
            </div>
          ) : (
            <div>
              {paper.fileType.toLowerCase() === 'pdf' ? (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  <iframe
                    src={`${previewUrl}#toolbar=0`}
                    style={{
                      width: '100%',
                      height: '700px',
                      border: 'none',
                    }}
                    title={paper.title}
                  />
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  overflow: 'auto',
                  maxHeight: '750px'
                }}>
                  <img
                    src={previewUrl}
                    alt={paper.title}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                  />
                </div>
              )}
            </div>
          )}
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
