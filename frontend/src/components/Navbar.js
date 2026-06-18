'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Logo */}
        <Link href={user ? (isAdmin() ? '/admin' : '/dashboard') : '/'} style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: '800',
            color: 'white',
          }}>P</div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
          }}>Paper<span style={{ color: 'var(--primary)' }}>Bank</span></span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            {isAdmin() ? (
              <>
                <NavLink href="/admin" active={pathname === '/admin'}>Dashboard</NavLink>
                <NavLink href="/admin/upload" active={pathname === '/admin/upload'}>Upload</NavLink>
                <NavLink href="/admin/manage" active={pathname === '/admin/manage'}>Manage</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
                <NavLink href="/dashboard/papers" active={pathname.startsWith('/dashboard/papers')}>Papers</NavLink>
              </>
            )}
            <NavLink href="/ai" active={pathname === '/ai'}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✨ AI Assistant
              </span>
            </NavLink>
          </div>
        )}

        {/* User Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-glass)',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'white',
                }}>
                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {user.fullName}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {user.role}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>▼</span>
              </div>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  minWidth: '180px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  animation: 'fadeIn 0.2s ease-out',
                }}>
                  <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                    {user.email}
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>
                Login
              </Link>
              <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 22px', fontSize: '0.9rem' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link href={href} style={{
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.9rem',
      fontWeight: active ? '600' : '500',
      color: active ? 'var(--primary-light)' : 'var(--text-secondary)',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      transition: 'all 0.2s',
    }}>
      {children}
    </Link>
  );
}
