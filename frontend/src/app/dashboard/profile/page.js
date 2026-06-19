'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { authAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function StudentProfilePage() {
  const { user, loading, logout, updateUser } = useAuth();
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [course, setCourse] = useState('');
  
  // Status State
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setFullName(user.fullName || '');
      setRollNo(user.rollNo || '');
      setCourse(user.course || '');
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  // Format creation date
  const joinedDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  // Get initials for profile picture
  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const updatedUser = await authAPI.updateProfile({
        fullName,
        rollNo,
        course
      });
      
      updateUser(updatedUser);
      setMessage({ text: 'Academic profile updated successfully! ✨', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Failed to update profile details.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '750px', margin: '0 auto', padding: '40px 24px' }} className="animate-fade-in">
        {/* Navigation & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile Card Summary */}
        <div className="glass-card" style={{ padding: '36px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative background glow */}
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Profile Picture (Initials Avatar) */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            boxShadow: 'var(--shadow-glow)',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}>
            {getInitials(fullName || user.fullName)}
          </div>

          <div style={{ zIndex: 1, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>{user.fullName}</h1>
              <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>{user.role}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
              🎓 Student Account • Joined {joinedDate}
            </p>
          </div>
        </div>

        {/* Status Notification Message */}
        {message.text && (
          <div 
            className={`animate-fade-in`} 
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              border: '1px solid',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: message.type === 'success' ? 'var(--success)' : 'var(--error)',
              color: message.type === 'success' ? '#34d399' : '#f87171',
              fontWeight: '500'
            }}
          >
            {message.text}
          </div>
        )}

        {/* Academic Details Management Form */}
        <div className="glass-card" style={{ padding: '36px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Manage Academic Profile
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Read-Only) */}
            <div>
              <label className="form-label" htmlFor="email">Email Address (Read-Only)</label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={user.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }}
              />
            </div>

            {/* Enrollment Course */}
            <div>
              <label className="form-label" htmlFor="course">Enrollment Course</label>
              <input
                id="course"
                type="text"
                className="input-field"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g., B.Tech Computer Science, BCA, MCA"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="form-label" htmlFor="rollNo">Roll Number</label>
              <input
                id="rollNo"
                type="text"
                className="input-field"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter your student roll number"
              />
            </div>

            {/* Save Button */}
            <div style={{ marginTop: '8px' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Account ID: #{user.id} • Secure SSL Session active
          </div>
          <button onClick={logout} className="btn-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            🚪 Log Out Account
          </button>
        </div>
      </main>
    </div>
  );
}
