// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CATEGORIES = [
  { value: 'LEGAL', label: 'Legal' }, { value: 'FINANCIAL', label: 'Financiero' },
  { value: 'TRAINING', label: 'Formación' }, { value: 'NETWORKING', label: 'Networking' },
  { value: 'CONSULTING', label: 'Consultoría' }, { value: 'BENEFITS', label: 'Beneficios' },
  { value: 'OTHER', label: 'Otro' },
];

export default function ServiciosPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'OTHER', contactInfo: '', externalLink: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['services-admin'],
    queryFn: () => api.get('/services?perPage=50').then(r => r.data),
  });

  const create = useMutation({
    mutationFn: () => api.post('/services', { ...form, isActive: true }),
    onSuccess: () => {
      toast.success('Servicio creado'); qc.invalidateQueries({ queryKey: ['services-admin'] });
      setShowForm(false); setForm({ title: '', description: '', category: 'OTHER', contactInfo: '', externalLink: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Error al crear el servicio');
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => { toast.success('Servicio desactivado'); qc.invalidateQueries({ queryKey: ['services-admin'] }); },
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Gestión de Servicios" />
      <main className="p-6 space-y-4 max-w-5xl">
        <div className="flex justify-end">
          <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> {showForm ? 'Cancelar' : 'Nuevo Servicio'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h3 className="sm:col-span-2 font-semibold text-gray-800">Nuevo Servicio</h3>
              <input className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1]" placeholder="Título del servicio *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1]" rows={3} placeholder="Descripción del servicio *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <input className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" placeholder="Información de contacto" value={form.contactInfo} onChange={e => setForm({ ...form, contactInfo: e.target.value })} />
              <input className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1]" placeholder="Enlace externo (URL)" value={form.externalLink} onChange={e => setForm({ ...form, externalLink: e.target.value })} />
              <div className="sm:col-span-2 flex justify-end">
                <Button onClick={() => create.mutate()} loading={create.isPending}>Guardar Servicio</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {isLoading ? <p className="text-center text-gray-400 py-12">Cargando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(data?.data ?? []).map((svc: any) => (
              <Card key={svc.id} className="flex flex-col">
                <CardBody className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900">{svc.title}</p>
                    <StatusBadge status={svc.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{svc.description}</p>
                  {svc.contactInfo && <p className="text-xs text-gray-400">Contacto: {svc.contactInfo}</p>}
                </CardBody>
                <div className="px-4 pb-4">
                  <Button size="sm" variant="danger" className="gap-1 w-full" onClick={() => remove.mutate(svc.id)}>
                    <Trash2 className="w-3.5 h-3.5" /> Desactivar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
