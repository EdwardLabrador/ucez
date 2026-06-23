// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { useAuthStore } from '@/store/auth.store';
import { Download, FileText, Users, DollarSign, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

function downloadFile(url: string, token: string) {
  const a = document.createElement('a');
  a.href = `${API}${url}?token=${token}`;
  a.click();
}

async function fetchCsv(url: string, filename: string, token: string) {
  const res = await fetch(`${API}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al generar reporte');
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

const REPORTS = [
  {
    id: 'affiliates',
    titulo: 'Listado de Afiliados',
    desc: 'Exporta todos los afiliados con sus datos de membresía, contacto y estado actual.',
    icon: Users,
    color: 'bg-blue-50 text-[#1a3c6e]',
    filename: 'afiliados.csv',
    url: '/reports/affiliates',
    roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
  },
  {
    id: 'payments',
    titulo: 'Historial de Pagos',
    desc: 'Exporta todos los cobros con estado, montos, métodos de pago y referencias.',
    icon: DollarSign,
    color: 'bg-green-50 text-green-700',
    filename: 'pagos.csv',
    url: '/reports/payments',
    roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
    hasDateFilter: true,
  },
  {
    id: 'financial-summary',
    titulo: 'Resumen Financiero',
    desc: 'Resumen de ingresos agrupados por estado de pago y totales por período.',
    icon: BarChart2,
    color: 'bg-amber-50 text-amber-700',
    filename: 'resumen-financiero.csv',
    url: '/reports/financial-summary',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
];

export default function ReportesPage() {
  const { accessToken: token, user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleDownload = async (report: typeof REPORTS[0]) => {
    if (!token) return;
    setLoading(report.id);
    try {
      let url = report.url;
      if (report.hasDateFilter && (from || to)) {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        url += `?${params.toString()}`;
      }
      await fetchCsv(url, report.filename, token);
      toast.success(`Reporte "${report.titulo}" descargado`);
    } catch {
      toast.error('Error al descargar el reporte');
    } finally {
      setLoading(null);
    }
  };

  const visible = REPORTS.filter(r => r.roles.includes(user?.role ?? ''));

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <TopBar title="Reportes" />
      <main className="p-6 max-w-5xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#1a3c6e]" />
            <h2 className="text-base font-black text-gray-900">Filtro por Fecha (Pagos)</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">Aplica este rango al reporte de Historial de Pagos.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Desde</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Hasta</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((r) => {
            const Icon = r.icon;
            const isLoading = loading === r.id;
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${r.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{r.titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{r.desc}</p>
                <button
                  onClick={() => handleDownload(r)}
                  disabled={isLoading}
                  className="mt-5 flex items-center justify-center gap-2 w-full bg-[#1a3c6e] hover:bg-[#152f57] text-white text-sm font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                >
                  {isLoading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Download className="w-4 h-4" />}
                  {isLoading ? 'Generando...' : 'Descargar CSV'}
                </button>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
