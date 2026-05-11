import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function AdminLogin() {
  const login    = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login({ Email: form.email, Password: form.password, RememberMe: false })
      if (user.role !== 'Admin') {
        useAuthStore.getState().logout()
        setError('Credenciales de administrador inválidas.')
        return
      }
      navigate('/admin/media')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Credenciales de administrador inválidas.')
    } finally {
      setLoading(false)
    }
  }

  const field = (name) => ({
    id:       name,
    value:    form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase
                           text-amber bg-amber/10 border border-amber/30 px-3 py-1
                           rounded-full mb-4">
            Acceso Admin
          </span>
          <h1
            onClick={() => navigate('/')}
            className="font-display text-4xl font-extrabold text-white mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            Media<span className="text-amber">Stream</span>
          </h1>
          <p className="text-muted text-sm">Portal de administrador</p>
        </div>

        <div className="glass-amber rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Correo del administrador" type="email" placeholder="admin@ejemplo.com" required {...field('email')} />
            <Input label="Contraseña" type="password" placeholder="••••••••" required {...field('password')} />

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" variant="amber" className="w-full" size="lg" isLoading={loading}>
              Ingresar como administrador
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-muted hover:text-white transition-colors">
              ← Volver al acceso de usuarios
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
