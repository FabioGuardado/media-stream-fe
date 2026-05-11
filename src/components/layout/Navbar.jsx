import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

const AUTH_PATHS = ['/login', '/register', '/admin/login']

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (AUTH_PATHS.includes(pathname)) return null

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-extrabold tracking-tight text-white hover:text-accent transition-colors"
        >
          Media<span className="text-accent">Stream</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-sm text-muted hidden sm:block">
                {currentUser.name}
              </span>

              {isAdmin() && (
                <Link
                  to="/admin/media"
                  className="text-sm px-3 py-1.5 rounded-md bg-amber/10 text-amber border border-amber/30 hover:bg-amber/20 transition-colors font-medium"
                >
                  Panel Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-md text-muted hover:text-white hover:bg-card transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-muted hover:text-white transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors font-medium"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
