import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'El nombre es obligatorio.';
    if (!form.lastName.trim()) e.lastName = 'El apellido es obligatorio.';
    if (!form.email.includes('@')) e.email = 'Ingresa un correo válido.';
    if (form.password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await register({
        FirstName: form.firstName,
        LastName: form.lastName,
        Email: form.email,
        Password: form.password,
      });
      navigate('/');
    } catch (err) {
      setErrors({
        email: err.response?.data?.message ?? 'Error al registrarse. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const field = (name) => ({
    id: name,
    value: form[name],
    error: errors[name],
    onChange: (e) => {
      setForm((f) => ({ ...f, [name]: e.target.value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    },
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
          <p className="text-muted text-sm">Crea tu cuenta gratis</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre" placeholder="Juan" required {...field('firstName')} />
              <Input label="Apellido" placeholder="Pérez" required {...field('lastName')} />
            </div>
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
              placeholder="Mín. 6 caracteres"
              required
              {...field('password')}
            />
            <Input
              label="Confirma la contraseña"
              type="password"
              placeholder="Repite la contraseña"
              required
              {...field('confirm')}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
