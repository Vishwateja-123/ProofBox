import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Shield,
  X,
  LayoutDashboard,
  ShoppingBag,
  CalendarClock,
  ShieldAlert,
  Receipt,
  User,
  Plus,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Sidebar({ isOpen, onClose, expiringCount = 0 }) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-drawer-overlay" onClick={onClose} />
      <aside className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <Link to="/" className="brand-badge" onClick={onClose}>
            <div className="brand-icon-emblem">
              <Shield size={16} strokeWidth={2.4} />
            </div>
            <span>ProofBox</span>
          </Link>
          <button
            onClick={onClose}
            className="btn btn-subtle btn-icon"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mobile-drawer-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </span>
          </NavLink>

          <NavLink
            to="/purchases"
            end
            className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShoppingBag size={18} />
              <span>My Products</span>
            </span>
          </NavLink>

          <NavLink
            to="/warranties"
            className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <CalendarClock size={18} />
              <span>Warranties</span>
            </span>
          </NavLink>

          <NavLink
            to="/expiring"
            className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldAlert size={18} />
              <span>Expiring</span>
            </span>
            {expiringCount > 0 && (
              <span className="nav-pill-badge">{expiringCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/receipts"
            className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Receipt size={18} />
              <span>Receipts</span>
            </span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <User size={18} />
              <span>Account</span>
            </span>
          </NavLink>
        </nav>

        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            to="/purchases/new"
            className="btn btn-primary"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            <Plus size={16} />
            <span>Add Purchase</span>
          </Link>

          {user && (
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
