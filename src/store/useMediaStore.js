import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mediaService } from '../services/mediaService';

export const useMediaStore = create(
  persist(
    (set, get) => ({
      items: [],
      uploading: false,
      uploadProgress: 0,
      error: null,

      upload: async (file, title = '', categoryId) => {
        set({ uploading: true, uploadProgress: 0, error: null });
        try {
          const { data } = await mediaService.upload(file, title.trim() || file.name, categoryId, (pct) =>
            set({ uploadProgress: pct }),
          );

          const newItem = {
            id: crypto.randomUUID(),
            dbId: data.id ?? data.Id,
            title: title.trim() || file.name,
            filename: data.archivo ?? data.Archivo,
            type: file.type.startsWith('video/') ? 'video' : 'audio',
            createdAt: new Date().toISOString(),
          };

          set((s) => ({
            items: [newItem, ...s.items],
            uploading: false,
            uploadProgress: 100,
          }));

          return newItem;
        } catch (err) {
          set({ uploading: false, error: err.message });
          throw err;
        }
      },

      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      getStreamUrl: (filename) => mediaService.getStreamUrl(filename),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'sv-media',
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
