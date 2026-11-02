import React, { useEffect, useRef, useState } from 'react';

/**
 * Official Google 'G' Multicolor Logo
 */
export function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.15 0 9.97 0 12s.45 3.85 1.25 5.43l4.03-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.57 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

/**
 * Professional Google Identity Services (GIS) Sign-In Button
 * Matches ProofBox's Apple Human Interface Design System
 */
export function GoogleSignInButton({
  onSuccess,
  onError,
  loading = false,
  label = 'Continue with Google'
}) {
  const googleBtnContainerRef = useRef(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [btnRendered, setBtnRendered] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // 1. Asynchronously load the official Google Identity Services library
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGisLoaded(true);
      return;
    }

    const scriptId = 'google-identity-services-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGisLoaded(true);
      script.onerror = () => {
        console.warn('[ProofBox] Failed to load Google Identity Services SDK.');
      };
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', () => setGisLoaded(true));
    }
  }, []);

  // 2. Initialize Google Identity Services and render official button if Client ID exists
  useEffect(() => {
    if (!gisLoaded || !clientId || !window.google?.accounts?.id) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else {
            onError?.('No credential returned by Google.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      if (googleBtnContainerRef.current) {
        googleBtnContainerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 380
        });
        setBtnRendered(true);
      }
    } catch (err) {
      console.error('[ProofBox] Google Identity Services initialization error:', err);
    }
  }, [gisLoaded, clientId, onSuccess, onError]);

  // Fallback / Guidance handler if clicked when Client ID is not yet configured in .env
  const handleUnconfiguredClick = () => {
    if (!clientId) {
      const guidance =
        'Google Client ID is not configured yet. Please set VITE_GOOGLE_CLIENT_ID in frontend/.env and GOOGLE_CLIENT_ID in backend/.env to activate live Google Sign-In.';
      onError?.(guidance);
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div style={{ width: '100%', marginBottom: '1.25rem' }}>
      {/* Container for official Google Identity Services rendered button */}
      <div
        ref={googleBtnContainerRef}
        style={{
          display: btnRendered && clientId ? 'flex' : 'none',
          justifyContent: 'center',
          width: '100%',
          minHeight: '44px'
        }}
      />

      {/* ProofBox Apple-styled Branded Google Button (Displayed if GIS button is loading, client ID is unconfigured, or as primary branded trigger) */}
      {(!btnRendered || !clientId) && (
        <button
          type="button"
          onClick={handleUnconfiguredClick}
          disabled={loading}
          className="btn"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            backgroundColor: '#ffffff',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0.7rem 1.25rem',
            fontSize: '0.92rem',
            fontWeight: '500',
            fontFamily: 'inherit',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#fbfbfd';
              e.currentTarget.style.borderColor = 'var(--text-tertiary)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
          }}
        >
          <GoogleIcon size={18} />
          <span>{loading ? 'Authenticating with Google...' : label}</span>
        </button>
      )}

      {/* Elegant visual divider between Google Sign-In and Email/Password */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.25rem 0 0.5rem 0',
          color: 'var(--text-tertiary)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: '600'
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        <span style={{ padding: '0 0.85rem' }}>or continue with email</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
      </div>
    </div>
  );
}

export default GoogleSignInButton;

