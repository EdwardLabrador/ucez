// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Plus, Pencil, Trash2, X, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin', ADMIN: 'Administrador', STAFF: 'Staff', AFFILIATE: 'Afiliado',
};
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  STAFF: 'bg-cyan-100 text-cyan-700',
  AFFILIATE: 'bg-gray-100 text-gray-600',
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
  SUSPENDED: 'bg-red-100 text-red-600',
};

const schema = z.object({
  name:     z.string().min(2, 'Nombre requerido'),
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  role:     z.enum(['SUPER_ADMIN', 'ADMIN', 'STAFF', 'AFFILIATE']),
});
type FormData = z.infer<typeof schema>;

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function UsuariosPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STAFF' },
  });

  const create = useMutation({
    mutationFn: (d: FormData) => api.post('/users', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setModal(null); reset(); toast.success('Usuario creado'); },
    onError: () => toast.error('Error al crear usuario'),
  });

  const update = useMutation({
    mutationFn: (d: FormData) => api.put(`/users/${selected?.id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setModal(null); toast.success('Usuario actualizado'); },
    onError: () => toast.error('Error al actualizar'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Usuario eliminado'); },
    onError: () => toast.error('Error al eliminar'),
  });

  const onSubmit = (d: FormData) => {
    if (modal === 'create') create.mutate(d);
    else update.mutate(d);
  };

  const openEdit = (u: any) => {
    setSelected(u);
    reset({ name: u.name, email: u.email, role: u.role, password: '' });
    setModal('edit');
  };

  const openCreate = () => { reset({ role: 'STAFF' }); setModal('create'); };

  const users: any[] = (data?.data ?? data ?? []).filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <TopBar title="Gestión de Usuarios" />
      <main className="p-6 max-w-5xl mx-auto space-y-5">

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <input
            placeholder="Buscar por nombre o email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
          />
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-[#4169E1] hover:bg-[#152f57] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Nuevo Usuario
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#4169E1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No se encontraron usuarios</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Usuario', 'Rol', 'Estado', 'Último Acceso', 'Acciones'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#4169E1] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{u.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        <ShieldCheck className="w-3 h-3" />
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[u.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {u.status === 'ACTIVE' ? 'Activo' : u.status === 'INACTIVE' ? 'Inactivo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('es-VE') : 'Nunca'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)}
                          className="p-1.5 text-gray-400 hover:text-[#4169E1] hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm('¿Eliminar usuario?')) remove.mutate(u.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {modal && (
        <Modal title={modal === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre completo</label>
              <input {...register('name')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
              <input {...register('email')} type="email" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                {modal === 'edit' ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
              </label>
              <input {...register('password')} type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Rol</label>
              <select {...register('role')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white">
                {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={create.isPending || update.isPending}
                className="flex-1 bg-[#4169E1] hover:bg-[#152f57] text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
                {create.isPending || update.isPending ? 'Guardando...' : modal === 'create' ? 'Crear' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
