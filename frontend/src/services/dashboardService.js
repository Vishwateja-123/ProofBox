import { request } from './api.js';

export const dashboardService = {
  async getDashboardSummary() {
    return request('/dashboard/summary', { method: 'GET' });
  }
};
