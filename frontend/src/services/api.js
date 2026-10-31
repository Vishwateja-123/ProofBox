/**
 * ProofBox — Centralized API Client
 * Wraps fetch with authorization headers, cookie handling, and unified error parsing
 */

const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  // Retrieve stored auth token (if available)
  const token = localStorage.getItem('proofbox_token');

  const headers = {
    ...options.headers
  };

  // Add json content-type if body is JSON string and not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach Bearer token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // include cookies
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If unauthorized, clear local token
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('proofbox_token');
        localStorage.removeItem('proofbox_user');
      }

      let errorMessage =
        data.message || (data.errors && data.errors.join(', '));

      if (!errorMessage) {
        if (response.status === 500 || response.status === 502 || response.status === 503) {
          errorMessage = 'Unable to connect to ProofBox backend server (port 5001). Please ensure both MongoDB and the backend server are running.';
        } else {
          errorMessage = `Request failed with status ${response.status}`;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}
