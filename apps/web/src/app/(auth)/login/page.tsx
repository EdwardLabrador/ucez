// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Ingrese un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useLogin();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1e38] to-[#1a3c6e] flex items-center justify-center p-4">
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
          <h2 className="text-xl font-bold text-gray-800 mb-1">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500 mb-6">Ingrese sus credenciales para continuar</p>

          <form onSubmit={handleSubmit((data) => login.mutate(data as FormData))} className="space-y-4">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="correo@empresa.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              loading={login.isPending}
            >
              Ingresar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-blue-300 mt-6">
          © 2026 UCEZ — Todos los Derechos Reservados
        </p>
      </div>
    </div>
  );
}
