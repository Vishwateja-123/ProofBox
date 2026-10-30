import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Plus, Menu, User, LogOut, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Navbar({ onMenuClick, expiringCount = 0 }) {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'PB';
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="header-nav">
      <div className="header-container">
        <Link to="/" className="brand-badge" aria-label="ProofBox Home">
          <div className="brand-icon-emblem">
            <Shield size={16} strokeWidth={2.4} />
          </div>
          <span>ProofBox</span>
        </Link>

        <nav className="nav-links-desktop" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          >
            Overview
          </NavLink>
          <NavLink
            to="/purchases"
            end
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          >
            My Products
          </NavLink>
          <NavLink
            to="/warranties"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          >
            Warranties
          </NavLink>
          <NavLink
            to="/expiring"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          >
            <span>Expiring</span>
            {expiringCount > 0 && (
              <span className="nav-pill-badge" title={`${expiringCount} expiring soon`}>
                {expiringCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/receipts"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          >
            Receipts
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          >
            Account
          </NavLink>
        </nav>

        <div className="nav-actions-desktop">
          <Link to="/purchases/new" className="btn btn-primary btn-sm">
            <Plus size={15} strokeWidth={2.2} />
            <span>Add Purchase</span>
          </Link>

          {user && (
            <Link
              to="/profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: '600',
                textDecoration: 'none',
                border: '1px solid var(--border-subtle)'
              }}
              title={`Signed in as ${user.name}`}
              aria-label="Account profile"
            >
              {getInitials(user.name)}
            </Link>
          )}

          <button
            className="mobile-nav-toggle"
            onClick={onMenuClick}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
