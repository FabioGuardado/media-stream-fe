import api from '../lib/api';

export const authService = {
  register: (userData) => api.post('/api/Account', userData),
  login: (credentials) => api.post('/api/Account/login', credentials),
};
