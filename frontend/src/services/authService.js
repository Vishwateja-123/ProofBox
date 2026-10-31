import { request } from './api.js';

export const authService = {
  async register(name, email, password) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data.token) {
      localStorage.setItem('proofbox_token', data.token);
      localStorage.setItem('proofbox_user', JSON.stringify(data.user));
    }
    return data;
  },

  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('proofbox_token', data.token);
      localStorage.setItem('proofbox_user', JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('proofbox_token');
      localStorage.removeItem('proofbox_user');
    }
  },

  async getProfile() {
    return request('/auth/profile', { method: 'GET' });
  }
};
