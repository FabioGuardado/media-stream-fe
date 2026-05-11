import api from '../lib/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const mediaService = {
  upload: (file, title, categoryId, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('categoryId', categoryId);
    return api.post('/api/Videos/upload', form, {
      headers: { 'Content-Type': undefined },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },

  getById: (id, signal) => api.get(`/api/Videos/media/${id}`, { signal }),

  registerView: (id, signal) => api.post(`/api/Videos/media/${id}/view`, null, { signal }),

  getStreamUrl: (filename) => `${BASE_URL}/api/Videos/stream/${encodeURIComponent(filename)}`,
};
