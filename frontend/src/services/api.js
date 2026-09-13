import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const telemetryService = {
  getLatest: async () => {
    try {
      const response = await api.get('/telemetry/latest');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest telemetry:', error);
      throw error;
    }
  },
  getHistory: async (limit = 100) => {
    try {
      const response = await api.get(`/telemetry/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching telemetry history:', error);
      throw error;
    }
  }
};

export const alertService = {
  getActive: async () => {
    try {
      const response = await api.get('/alerts/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      throw error;
    }
  },
  resolveAlert: async (id) => {
    try {
      const response = await api.put(`/alerts/${id}/resolve`);
      return response.data;
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }
};

export default api;
