// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { Settings, Save, Building2, CreditCard, Tag, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const GROUP_LABELS: Record<string, { label: string; icon: any }> = {
  general: { label: 'Información General', icon: Building2 },
  payment: { label: 'Datos de Pago', icon: CreditCard },
  plans:   { label: 'Precios de Planes', icon: Tag },
  email:   { label: 'Configuración de Email', icon: Mail },
};

export default function ConfiguracionPage() {
  const qc = useQueryClient();
  const [edited, setEdited] = useState<Record<string, string>>({});

  const { data: grouped, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  });

  const save = useMutation({
    mutationFn: () => {
      const updates = Object.entries(edited).map(([key, value]) => ({ key, value }));
      return api.patch('/settings', { updates });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setEdited({});
      toast.success('Configuración guardada');
    },
    onError: () => toast.error('Error al guardar'),
  });

  const getValue = (key: string, fallback: string) => edited[key] ?? fallback;
  const hasChanges = Object.keys(edited).length > 0;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a3c6e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <TopBar title="Configuración" />
      <main className="p-6 max-w-4xl mx-auto space-y-6">

        {Object.entries(grouped ?? {}).map(([group, settings]: [string, any]) => {
          const meta = GROUP_LABELS[group] ?? { label: group, icon: Settings };
          const Icon = meta.icon;
          return (
            <div key={group} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
                <Icon className="w-5 h-5 text-[#1a3c6e]" />
                <h2 className="font-black text-gray-900">{meta.label}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {settings.map((s: any) => (
                  <div key={s.key} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 sm:w-64 flex-shrink-0">
                      {s.label}
                    </label>
                    <input
                      type="text"
                      value={getValue(s.key, s.value)}
                      onChange={e => setEdited(prev => ({ ...prev, [s.key]: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {hasChanges && (
          <div className="sticky bottom-4">
            <div className="bg-[#1a3c6e] rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
              <p className="text-white text-sm font-medium">
                Tienes cambios sin guardar
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setEdited({})}
                  className="text-blue-200 hover:text-white text-sm font-semibold transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={() => save.mutate()}
                  disabled={save.isPending}
                  className="flex items-center gap-2 bg-[#c8932a] hover:bg-[#b07d22] text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {save.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
