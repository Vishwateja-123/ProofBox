import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to ProofBox!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@proofbox.com');
    setPassword('DemoPassword123!');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundColor: 'var(--bg-canvas)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}
      >
        {/* Left Side: ProofBox Brand Storytelling (Desktop) */}
        <div style={{ padding: '1rem 0' }}>
          <div className="brand-badge" style={{ marginBottom: '1.75rem', fontSize: '1.25rem' }}>
            <div className="brand-icon-emblem" style={{ width: '32px', height: '32px' }}>
              <Shield size={18} strokeWidth={2.4} />
            </div>
            <span>ProofBox</span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              letterSpacing: '-0.035em',
              lineHeight: '1.1',
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}
          >
            Everything you own. <br />
            Beautifully protected.
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '2rem',
              maxWidth: '400px'
            }}
          >
            A personal ownership vault that calculates warranty expiration dates, organizes proof-of-purchase receipts, and alerts you before coverage ends.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--status-active-bar)' }} />
              <span>Authoritative warranty tracking and 30-day countdowns</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--status-active-bar)' }} />
              <span>Safe local receipt storage for invoices, PDFs, and images</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--status-active-bar)' }} />
              <span>Zero-knowledge client security with strict user data isolation</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Authentication Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                letterSpacing: '-0.025em',
                marginBottom: '0.35rem',
                color: 'var(--text-primary)'
              }}
            >
              Welcome back.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Sign in to manage your purchases and warranties.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'var(--status-expired-bg)',
                border: '1px solid var(--status-expired-border)',
                color: 'var(--status-expired-text)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                  }}
                />
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                  }}
                />
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem' }}
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Local Development Demo Account Fill */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="btn btn-subtle btn-sm"
              style={{ width: '100%', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
            >
              <Sparkles size={13} style={{ color: 'var(--primary)' }} />
              <span>Fill Demo Credentials (Local Dev)</span>
            </button>
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: '600' }}>
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
