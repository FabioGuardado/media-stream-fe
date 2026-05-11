import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function UserLogin() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ Email: form.email, Password: form.password, RememberMe: false });
      if (user.role === 'Admin') {
        useAuthStore.getState().logout();
        setError('Los administradores deben usar el acceso de administrador.');
        return;
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const field = (name) => ({
    id: name,
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <h1
            onClick={() => navigate('/')}
            className="font-display text-4xl font-extrabold text-white mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            Media<span className="text-accent">Stream</span>
          </h1>
          <p className="text-muted text-sm">Inicia sesión en tu cuenta</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@ejemplo.com"
              required
              {...field('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              required
              {...field('password')}
            />

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted space-y-2">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-accent hover:underline">
                Registrarse
              </Link>
            </p>
            <p>
              <Link to="/admin/login" className="text-amber hover:underline text-xs">
                Acceso de administrador →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
