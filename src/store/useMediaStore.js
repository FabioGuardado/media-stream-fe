import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mediaService } from '../services/mediaService'

/**
 * Store de media con persistencia local (localStorage).
 *
 * No existe endpoint de listado en la API; los metadatos de los archivos
 * subidos se guardan localmente y sobreviven recargas de página.
 *
 * Cada ítem tiene la forma:
 *   { id, title, filename, type, createdAt }
 */
export const useMediaStore = create(
  persist(
    (set, get) => ({
      items:          [],
      uploading:      false,
      uploadProgress: 0,
      error:          null,

      /**
       * Sube un archivo y agrega sus metadatos al store local.
       * @param {File}   file         - Archivo a subir
       * @param {string} title        - Título opcional (por defecto: nombre del archivo)
       */
      upload: async (file, title = '') => {
        set({ uploading: true, uploadProgress: 0, error: null })
        try {
          const { data } = await mediaService.upload(file, (pct) =>
            set({ uploadProgress: pct })
          )

          const newItem = {
            id:        crypto.randomUUID(),
            title:     title.trim() || file.name,
            filename:  data.archivo ?? data.Archivo,
            type:      file.type.startsWith('video/') ? 'video' : 'audio',
            createdAt: new Date().toISOString(),
          }

          set((s) => ({
            items:          [newItem, ...s.items],
            uploading:      false,
            uploadProgress: 100,
          }))

          return newItem
        } catch (err) {
          set({ uploading: false, error: err.message })
          throw err
        }
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      getStreamUrl: (filename) => mediaService.getStreamUrl(filename),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'sv-media',
      partialize: (s) => ({ items: s.items }),
    }
  )
)
