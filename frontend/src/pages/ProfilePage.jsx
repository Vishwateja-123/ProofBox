import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Shield,
  ShoppingBag,
  LogOut,
  GraduationCap,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronUp,
  Code2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardService } from '../services/dashboardService.js';
import { formatDate, formatCurrency } from '../utils/dateUtils.js';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await dashboardService.getDashboardSummary();
        if (res.success) {
          setStats(res.summary);
        }
      } catch {
        // non-blocking
      }
    }
    loadStats();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'PB';
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-editorial-badge" style={{ marginBottom: '0.4rem' }}>
          <Sparkles size={13} />
          <span>Account Settings</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
          Your Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Manage your vault credentials, security settings, and personal ownership profile.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ padding: '2.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--text-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: '700',
                flexShrink: 0
              }}
            >
              {getInitials(user?.name)}
            </div>

            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {user?.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <Mail size={14} style={{ color: 'var(--text-tertiary)' }} />
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                <Calendar size={13} />
                <span>Member since {formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          <button onClick={logout} className="btn btn-secondary">
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Personal Vault Holdings Summary */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}
        >
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
              Vault Holdings
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '700', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
              {stats.totalPurchases} {stats.totalPurchases === 1 ? 'Product' : 'Products'}
            </div>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
              Protected Valuation
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '700', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
              {formatCurrency(stats.totalSpend)}
            </div>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
              Active Protection
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '700', marginTop: '0.35rem', color: 'var(--status-active-bar)' }}>
              {stats.activeWarranties} Warranties
            </div>
          </div>
        </div>
      )}

      {/* Security & Data Isolation Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={17} style={{ color: 'var(--primary)' }} />
          <span>Security & Data Protection</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.785rem' }}>Authentication</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>JWT Bearer & HttpOnly Cookies</div>
          </div>
          <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.785rem' }}>Password Encryption</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>Bcrypt Adaptive Salt Hashing</div>
          </div>
          <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.785rem' }}>Data Isolation</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>Strict User-Level Ownership Filter</div>
          </div>
        </div>
      </div>

      {/* Collapsible Section: About ProofBox (SR University Academic Project) */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div
          onClick={() => setAboutOpen(!aboutOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              About ProofBox (SR University Project)
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-subtle btn-icon"
            style={{ width: '28px', height: '28px' }}
            aria-label="Toggle Project Info"
          >
            {aboutOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {aboutOpen && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              ProofBox is a full-stack Warranty and Receipt Vault engineered as an academic mini-project at <strong>SR University</strong> by a dedicated five-student engineering team.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'var(--bg-canvas)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Institution</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.15rem' }}>SR University, Warangal</div>
              </div>
              <div style={{ background: 'var(--bg-canvas)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Architecture</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.15rem' }}>MERN (React + Express + Node + MongoDB)</div>
              </div>
              <div style={{ background: 'var(--bg-canvas)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Team Size</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.15rem' }}>5 Engineering Students</div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Engineering Team Roles
              </div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li><strong>Paidipelly Vishwa Teja:</strong> Team Lead & Integration Engineer</li>
                <li><strong>Kuchana Vyshnavi:</strong> Authentication & Security Developer</li>
                <li><strong>Arpula Anjali:</strong> Frontend & UI/UX Developer</li>
                <li><strong>Adapala Vamshi Krishna:</strong> Backend & MongoDB Developer</li>
                <li><strong>Jetti Mukesh:</strong> Warranty & Receipt Developer</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
