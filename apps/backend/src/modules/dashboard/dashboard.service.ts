// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [
      totalAffiliates,
      activeAffiliates,
      pendingAffiliates,
      totalPayments,
      pendingPayments,
      paidPayments,
      overduePayments,
      upcomingEvents,
      monthlyRevenue,
      recentPayments,
      monthlyChart,
    ] = await Promise.all([
      this.prisma.affiliate.count(),
      this.prisma.affiliate.count({ where: { membershipStatus: 'ACTIVE' } }),
      this.prisma.affiliate.count({ where: { membershipStatus: 'PENDING' } }),
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: 'PENDING' } }),
      this.prisma.payment.count({ where: { status: 'PAID' } }),
      this.prisma.payment.count({ where: { status: 'OVERDUE' } }),
      this.prisma.event.count({ where: { status: 'PUBLISHED', startDate: { gte: now } } }),
      this.prisma.payment.aggregate({
        where: { status: 'PAID', paidAt: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      this.prisma.payment.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { affiliate: { select: { businessName: true } } },
      }),
      this.getMonthlyChart(),
    ]);

    return {
      affiliates: { total: totalAffiliates, active: activeAffiliates, pending: pendingAffiliates },
      payments: {
        total: totalPayments,
        pending: pendingPayments,
        paid: paidPayments,
        overdue: overduePayments,
        monthlyRevenue: Number(monthlyRevenue._sum.amount ?? 0),
      },
      events: { upcoming: upcomingEvents },
      recentPayments,
      monthlyChart,
    };
  }

  private async getMonthlyChart() {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), 5 - i);
      return { start: startOfMonth(d), end: endOfMonth(d), label: format(d, 'MMM yyyy') };
    });

    const results = await Promise.all(
      months.map(async ({ start, end, label }) => {
        const agg = await this.prisma.payment.aggregate({
          where: { status: 'PAID', paidAt: { gte: start, lte: end } },
          _sum: { amount: true },
          _count: true,
        });
        return {
          mes: label,
          monto: Number(agg._sum.amount ?? 0),
          cantidad: agg._count,
        };
      }),
    );

    return results;
  }
}
