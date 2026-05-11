import api from '../lib/api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Servicio de media.
 *
 * POST /api/Videos/upload          → multipart field "file"
 *                                  ← { Mensaje: string, Archivo: string }
 *
 * GET  /api/Videos/stream/:filename → HTTP 206 range stream (construye la URL, no hace fetch)
 */
export const mediaService = {
  /**
   * Sube un archivo al servidor.
   * @param {File}     file        - Archivo a subir
   * @param {Function} onProgress  - Callback (pct: number) para el progreso
   */
  upload: (file, onProgress) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/api/Videos/upload', form, {
      // Dejar que el navegador fije Content-Type con el boundary correcto
      headers: { 'Content-Type': undefined },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
  },

  /**
   * Devuelve la URL de streaming para un archivo.
   * El reproductor nativo del navegador maneja los range requests.
   * @param {string} filename - Nombre del archivo tal como lo devuelve la API en Archivo
   */
  getStreamUrl: (filename) =>
    `${BASE_URL}/api/Videos/stream/${encodeURIComponent(filename)}`,
}
