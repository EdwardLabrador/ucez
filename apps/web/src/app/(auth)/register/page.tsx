// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'STAFF', 'AFFILIATE']),
});

type FormData = z.infer<typeof schema>;

const ROLES = [
  { value: 'AFFILIATE', label: 'Afiliado' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'SUPER_ADMIN', label: 'Super Administrador' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'AFFILIATE' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = res.data;
      setAuth(user, accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      toast.success(`Usuario creado. Bienvenido, ${user.name}`);
      if (user.role === 'AFFILIATE') {
        router.push('/portal/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e38] to-[#4169E1] flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#c8932a] mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">U</span>
          </div>
          <h1 className="text-2xl font-bold text-white">UCEZ</h1>
          <p className="text-blue-200 text-sm mt-1">Unión de Comerciantes del Estado Zulia</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Crear Usuario</h2>
          <p className="text-sm text-gray-500 mb-6">Completa los datos para registrar un nuevo usuario</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre Completo"
              placeholder="Juan Pérez"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="correo@empresa.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              error={errors.password?.message}
              {...register('password')}
            />
            <Select
              label="Tipo de Usuario"
              options={ROLES}
              error={errors.role?.message}
              {...register('role')}
            />

            <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
              Crear Usuario
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#4169E1] font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-blue-300 mt-6">
          © 2026 UCEZ — Todos los Derechos Reservados
        </p>
      </div>
    </div>
  );
}
