// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardBody } from '@/components/ui/Card';
import { ExternalLink, Briefcase } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  LEGAL: 'Legal', FINANCIAL: 'Financiero', TRAINING: 'Formación',
  NETWORKING: 'Networking', CONSULTING: 'Consultoría', BENEFITS: 'Beneficios', OTHER: 'Otro',
};

const CATEGORY_COLORS: Record<string, string> = {
  LEGAL: 'bg-purple-50 text-purple-700',
  FINANCIAL: 'bg-green-50 text-green-700',
  TRAINING: 'bg-blue-50 text-blue-700',
  NETWORKING: 'bg-orange-50 text-orange-700',
  CONSULTING: 'bg-yellow-50 text-yellow-700',
  BENEFITS: 'bg-pink-50 text-pink-700',
  OTHER: 'bg-gray-50 text-gray-700',
};

export default function PortalServiciosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['portal-services'],
    queryFn: () => api.get('/services?perPage=50').then(r => r.data),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Servicios y Beneficios</h1>
      <p className="text-sm text-gray-500">
        Como afiliado a UCEZ, tiene acceso a los siguientes servicios y beneficios institucionales.
      </p>

      {isLoading ? (
        <p className="text-center text-gray-400 py-12">Cargando servicios...</p>
      ) : (data?.data ?? []).length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No hay servicios disponibles en este momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(data?.data ?? []).map((svc: any) => (
            <Card key={svc.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardBody className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{svc.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[svc.category] ?? 'bg-gray-50 text-gray-700'}`}>
                    {CATEGORY_LABELS[svc.category] ?? 'Otro'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{svc.description}</p>
                {svc.contactInfo && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <strong>Contacto:</strong> {svc.contactInfo}
                  </p>
                )}
                {svc.externalLink && (
                  <a
                    href={svc.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#4169E1] hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Más información
                  </a>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
