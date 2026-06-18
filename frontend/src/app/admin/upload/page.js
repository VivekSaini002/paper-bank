'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { papersAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';

const COURSES = ['B.Tech', 'BCA', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'BA', 'MA'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const EXAM_TYPES = ['Mid Term', 'End Term', 'Supplementary', 'Internal', 'Practical'];

export default function UploadPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '', subjectName: '', subjectCode: '',
    course: '', semester: '', year: '', examType: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/login');
    }
  }, [user, authLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(extension)) {
        setError('Only PDF, JPG, and PNG files are allowed.');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('subjectName', formData.subjectName);
      form.append('subjectCode', formData.subjectCode);
      form.append('course', formData.course);
      form.append('semester', formData.semester);
      form.append('year', formData.year);
      if (formData.examType) form.append('examType', formData.examType);
      form.append('file', file);

      await papersAPI.upload(form);
      setSuccess('Paper uploaded successfully! 🎉');
      setFormData({ title: '', subjectName: '', subjectCode: '', course: '', semester: '', year: '', examType: '' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: '40px', height: '40px' }} />
    </div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            📤 Upload Question Paper
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Fill in the paper details and upload the file.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            padding: '14px 18px', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)',
            color: '#f87171', fontSize: '0.9rem', marginBottom: '20px',
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            padding: '14px 18px', background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)',
            color: '#34d399', fontSize: '0.9rem', marginBottom: '20px',
          }}>{success}</div>
        )}

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Paper Title *</label>
            <input
              type="text" name="title" className="input-field"
              placeholder="e.g. Data Structures End Term 2023"
              value={formData.title} onChange={handleChange} required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="form-label">Subject Name *</label>
              <input
                type="text" name="subjectName" className="input-field"
                placeholder="e.g. Data Structures"
                value={formData.subjectName} onChange={handleChange} required
              />
            </div>
            <div>
              <label className="form-label">Subject Code *</label>
              <input
                type="text" name="subjectCode" className="input-field"
                placeholder="e.g. CS201"
                value={formData.subjectCode} onChange={handleChange} required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="form-label">Course *</label>
              <select name="course" className="select-field" value={formData.course} onChange={handleChange} required>
                <option value="">Select</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Semester *</label>
              <select name="semester" className="select-field" value={formData.semester} onChange={handleChange} required>
                <option value="">Select</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Year *</label>
              <input
                type="number" name="year" className="input-field"
                placeholder="e.g. 2024"
                min="2000" max="2030"
                value={formData.year} onChange={handleChange} required
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Exam Type</label>
            <select name="examType" className="select-field" value={formData.examType} onChange={handleChange}>
              <option value="">Select (Optional)</option>
              {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: '32px' }}>
            <label className="form-label">Upload File (PDF, JPG, PNG — max 10MB) *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: file ? 'rgba(16,185,129,0.05)' : 'var(--bg-glass)',
                borderColor: file ? 'rgba(16,185,129,0.3)' : 'var(--border)',
              }}
            >
              {file ? (
                <>
                  <p style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</p>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>{file.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {(file.size / 1024).toFixed(0)} KB • Click to change
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📁</p>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>Click to upload or drag and drop</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PDF, JPG, PNG up to 10MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <><div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> Uploading...</>
            ) : (
              '📤 Upload Paper'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
