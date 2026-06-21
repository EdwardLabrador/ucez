// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findByUser(userId: string, onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(onlyUnread ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async create(data: { userId: string; type: any; title: string; body: string; channel?: any; referenceId?: string; referenceType?: string }) {
    return this.prisma.notification.create({ data: { channel: 'IN_APP', ...data } });
  }

  async sendPaymentConfirmation(userId: string, payment: any) {
    await this.create({
      userId,
      type: 'PAYMENT_CONFIRMED',
      title: 'Pago confirmado',
      body: `Su pago del período ${payment.period} por ${payment.currency} ${Number(payment.amount).toFixed(2)} ha sido registrado. Recibo: ${payment.receiptNumber}`,
      channel: 'BOTH',
      referenceId: payment.id,
      referenceType: 'payment',
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.emailService.sendPaymentConfirmationEmail(user.email, {
        businessName: payment.affiliate.businessName,
        receiptNumber: payment.receiptNumber,
        amount: payment.amount,
        currency: payment.currency,
        period: payment.period,
        paidAt: payment.paidAt,
        receiptUrl: payment.receiptUrl ? `${process.env.API_URL}${payment.receiptUrl}` : undefined,
      });
    }
  }

  async sendPaymentReminder(userId: string, payment: any) {
    await this.create({
      userId,
      type: 'PAYMENT_REMINDER',
      title: 'Recordatorio de pago',
      body: `Tiene un pago pendiente del período ${payment.period} por ${payment.currency} ${Number(payment.amount).toFixed(2)}. Vence el ${new Date(payment.dueDate).toLocaleDateString('es-EC')}.`,
      channel: 'BOTH',
      referenceId: payment.id,
      referenceType: 'payment',
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.emailService.sendPaymentReminderEmail(user.email, {
        businessName: payment.affiliate.businessName,
        amount: payment.amount,
        currency: payment.currency,
        period: payment.period,
        dueDate: payment.dueDate,
      });
    }
  }
}
