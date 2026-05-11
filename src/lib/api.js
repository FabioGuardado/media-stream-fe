import axios from 'axios'

/**
 * Cliente HTTP centralizado.
 * Para cambiar el backend, modificá VITE_API_URL en el archivo .env.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: adjunta el JWT en cada petición ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sv-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: manejo global de 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sv-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
