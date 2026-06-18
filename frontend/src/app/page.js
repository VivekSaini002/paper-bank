'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 24px 80px',
        textAlign: 'center',
      }}>
        {/* Animated Background Orbs */}
        <div style={{
          position: 'absolute', top: '-150px', left: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
          <div className="badge badge-primary" style={{ marginBottom: '20px', fontSize: '0.85rem' }}>
            🎓 Trusted by 1000+ Students
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '24px',
            letterSpacing: '-0.03em',
          }}>
            Your Ultimate{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Exam Prep</span>
            {' '}Companion
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            Access previous year question papers, get AI-powered solutions, and ace your exams. 
            Your all-in-one platform for smart exam preparation.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '1.05rem' }}>
              🚀 Get Started Free
            </Link>
            <Link href="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-slide-up">
          <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '16px' }}>
            Why Students Love <span style={{ color: 'var(--primary)' }}>PaperBank</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Everything you need to prepare for exams, in one powerful platform.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          <FeatureCard
            icon="📄"
            title="Vast Paper Library"
            description="Access thousands of previous year question papers organized by course, semester, subject, and year."
          />
          <FeatureCard
            icon="🤖"
            title="AI-Powered Solutions"
            description="Get instant solutions and explanations for any question paper using our advanced AI assistant."
          />
          <FeatureCard
            icon="📥"
            title="Easy Downloads"
            description="Download papers in PDF format for offline study. Study anywhere, anytime."
          />
          <FeatureCard
            icon="🔍"
            title="Smart Search"
            description="Find exactly what you need with powerful search and filters by course, semester, and year."
          />
          <FeatureCard
            icon="🔒"
            title="Secure & Reliable"
            description="Your data is protected with industry-standard security. Register once, access forever."
          />
          <FeatureCard
            icon="⚡"
            title="Lightning Fast"
            description="Optimized for speed. Find and access papers in seconds, not minutes."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '60px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center',
        }}>
          <StatItem number="5000+" label="Question Papers" />
          <StatItem number="1000+" label="Active Students" />
          <StatItem number="50+" label="Courses Covered" />
          <StatItem number="98%" label="Satisfaction Rate" />
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
            Ready to Ace Your Exams?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '36px' }}>
            Join thousands of students who are already preparing smarter, not harder.
          </p>
          <Link href="/register" className="btn-primary" style={{
            textDecoration: 'none',
            padding: '16px 40px',
            fontSize: '1.1rem',
          }}>
            🎯 Start Preparing Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
      }}>
        <p>© 2025 PaperBank. Built with ❤️ for students everywhere.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card" style={{ padding: '32px', cursor: 'default' }}>
      <div style={{
        fontSize: '2.5rem',
        marginBottom: '16px',
      }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div>
      <div style={{
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
      }}>{number}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{label}</div>
    </div>
  );
}
