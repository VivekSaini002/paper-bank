'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

const COURSES = ['B.Tech', 'BCA', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'BA', 'MA'];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNo: '',
    course: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        rollNo: formData.rollNo,
        course: formData.course,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 70px)',
        padding: '40px 24px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '15%', right: '20%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div className="glass-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '500px',
          padding: '48px 40px',
          position: 'relative',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: '24px', fontWeight: '800', color: 'white',
            }}>P</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Join PaperBank and start preparing</p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '0.9rem',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text" name="fullName" className="input-field"
                placeholder="John Doe"
                value={formData.fullName} onChange={handleChange} required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label className="form-label">Email Address *</label>
              <input
                type="email" name="email" className="input-field"
                placeholder="you@university.edu"
                value={formData.email} onChange={handleChange} required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label className="form-label">Roll Number</label>
                <input
                  type="text" name="rollNo" className="input-field"
                  placeholder="e.g. 2023001"
                  value={formData.rollNo} onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label">Course</label>
                <select name="course" className="select-field" value={formData.course} onChange={handleChange}>
                  <option value="">Select Course</option>
                  {COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label className="form-label">Password *</label>
                <input
                  type="password" name="password" className="input-field"
                  placeholder="Min 6 chars"
                  value={formData.password} onChange={handleChange} required minLength={6}
                />
              </div>
              <div>
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password" name="confirmPassword" className="input-field"
                  placeholder="Repeat password"
                  value={formData.confirmPassword} onChange={handleChange} required
                />
              </div>
            </div>

            <button
              type="submit" className="btn-primary" disabled={loading}
              style={{
                width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <><div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> Creating Account...</>
              ) : (
                '🚀 Create Account'
              )}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)',
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: '600', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
