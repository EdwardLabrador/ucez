// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async affiliatesCsv(): Promise<string> {
    const affiliates = await this.prisma.affiliate.findMany({
      orderBy: { businessName: 'asc' },
    });

    const headers = [
      'Razón Social', 'Nombre Comercial', 'RUC/RIF', 'Sector', 'Plan',
      'Estado', 'Teléfono', 'Email', 'Ciudad', 'Fecha Afiliación',
    ];

    const rows = affiliates.map((a) => [
      this.csv(a.businessName),
      this.csv(a.tradeName ?? ''),
      this.csv(a.ruc),
      this.csv(a.sector),
      this.csv(a.membershipPlan),
      this.csv(a.membershipStatus),
      this.csv(a.phone),
      this.csv(a.email),
      this.csv(a.city),
      this.csv(format(a.membershipStartDate, 'dd/MM/yyyy', { locale: es })),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  async paymentsCsv(from?: string, to?: string): Promise<string> {
    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const payments = await this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { affiliate: { select: { businessName: true, ruc: true } } },
    });

    const headers = [
      'N° Recibo', 'Afiliado', 'RUC/RIF', 'Período', 'Monto', 'Moneda',
      'Método', 'Referencia', 'Estado', 'Vencimiento', 'Fecha Pago',
    ];

    const rows = payments.map((p) => [
      this.csv(p.receiptNumber),
      this.csv(p.affiliate.businessName),
      this.csv(p.affiliate.ruc),
      this.csv(p.period),
      p.amount.toString(),
      this.csv(p.currency),
      this.csv(p.method ?? ''),
      this.csv(p.reference ?? ''),
      this.csv(p.status),
      this.csv(format(p.dueDate, 'dd/MM/yyyy', { locale: es })),
      this.csv(p.paidAt ? format(p.paidAt, 'dd/MM/yyyy', { locale: es }) : ''),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  async financialSummaryCsv(): Promise<string> {
    const payments = await this.prisma.payment.groupBy({
      by: ['status'],
      _sum: { amount: true },
      _count: true,
    });

    const headers = ['Estado', 'Cantidad', 'Monto Total (USD)'];
    const rows = payments.map((p) => [
      this.csv(p.status),
      p._count.toString(),
      (p._sum.amount ?? 0).toString(),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  private csv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
