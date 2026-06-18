'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
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
        {/* Background Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div className="glass-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '48px 40px',
          position: 'relative',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: '24px', fontWeight: '800', color: 'white',
            }}>P</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your papers</p>
          </div>

          {/* Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '1rem',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <><div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--primary-light)', fontWeight: '600', textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Admin: admin@paperbank.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
