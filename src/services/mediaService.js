import api from '../lib/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const mediaService = {
  upload: (file, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/Videos/upload', form, {
      // Dejar que el navegador fije Content-Type con el boundary correcto
      headers: { 'Content-Type': undefined },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },

  getStreamUrl: (filename) => `${BASE_URL}/api/Videos/stream/${encodeURIComponent(filename)}`,
};
