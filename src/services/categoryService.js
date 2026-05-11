import api from '../lib/api';

export const categoryService = {
  getAll: () => api.get('/api/Categories'),
};
