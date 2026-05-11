import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';

function extractUser(token) {
  const payload = jwtDecode(token);

  const get = (...keys) => {
    for (const k of keys) {
      if (payload[k] !== undefined) return payload[k];
    }
    return undefined;
  };

  return {
    id: get(
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
      'nameid',
      'sub',
    ),
    email: get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', 'email'),
    name: get(
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
      'given_name',
      'name',
    ),
    role: get('http://schemas.microsoft.com/ws/2008/06/identity/claims/role', 'role'),
  };
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,

      login: async (credentials) => {
        const { data } = await authService.login(credentials);
        const token = data.token ?? data.Token; // ASP.NET Core serializa en camelCase

        // El backend devuelve 200 con { Token: "Credenciales invalidas" } en vez de 401.
        // jwtDecode lanza InvalidTokenError si el string no es un JWT válido.
        let user;
        try {
          user = extractUser(token);
        } catch {
          throw new Error('Invalid credentials');
        }

        localStorage.setItem('sv-token', token);
        set({ currentUser: user, token });
        return user;
      },

      register: async ({ FirstName, LastName, Phone, Email, Password }) => {
        await authService.register({ FirstName, LastName, Phone, Email, Password });
        return get().login({ Email, Password, RememberMe: false });
      },

      logout: () => {
        localStorage.removeItem('sv-token');
        set({ currentUser: null, token: null });
      },

      isAdmin: () => get().currentUser?.role === 'Admin',
      isAuthenticated: () => !!get().currentUser,
    }),
    {
      name: 'sv-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
      }),
    },
  ),
);
