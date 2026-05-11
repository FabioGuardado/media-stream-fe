import api from '../lib/api'

/**
 * Servicio de autenticación.
 *
 * POST /api/Account        → { FirstName, LastName, Phone, Email, Password }
 *                          ← "Registro exitoso" (string)
 *
 * POST /api/Account/login  → { Email, Password, RememberMe }
 *                          ← { Token: string }
 */
export const authService = {
  register: (userData) => api.post('/api/Account', userData),
  login:    (credentials) => api.post('/api/Account/login', credentials),
}
