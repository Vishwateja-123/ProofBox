import { request } from './api.js';

export const purchaseService = {
  async getPurchases(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const endpoint = `/purchases${queryString ? `?${queryString}` : ''}`;
    return request(endpoint, { method: 'GET' });
  },

  async getExpiringPurchases() {
    return request('/purchases/expiring', { method: 'GET' });
  },

  async getPurchaseById(id) {
    return request(`/purchases/${id}`, { method: 'GET' });
  },

  async createPurchase(purchaseData) {
    return request('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData)
    });
  },

  async updatePurchase(id, purchaseData) {
    return request(`/purchases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(purchaseData)
    });
  },

  async deletePurchase(id) {
    return request(`/purchases/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadReceipt(file) {
    const formData = new FormData();
    formData.append('receipt', file);
    return request('/receipts/upload', {
      method: 'POST',
      body: formData
    });
  }
};
