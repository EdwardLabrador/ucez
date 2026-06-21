// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReceiptService } from './receipt.service';
import { CreatePaymentDto, RegisterPaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private receiptService: ReceiptService,
  ) {}

  async findAll(page = 1, perPage = 20, affiliateId?: string, status?: string) {
    const skip = (page - 1) * perPage;
    const where: any = {};
    if (affiliateId) where.affiliateId = affiliateId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: perPage,
        include: { affiliate: { select: { businessName: true, ruc: true, email: true } } },
        orderBy: { dueDate: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { affiliate: true },
    });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return payment;
  }

  async create(dto: CreatePaymentDto) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id: dto.affiliateId } });
    if (!affiliate) throw new NotFoundException('Afiliado no encontrado');

    const receiptNumber = await this.generateReceiptNumber();

    return this.prisma.payment.create({
      data: {
        affiliateId: dto.affiliateId,
        amount: dto.amount,
        currency: dto.currency || 'USD',
        period: dto.period,
        dueDate: new Date(dto.dueDate),
        method: dto.method as any,
        reference: dto.reference,
        notes: dto.notes,
        receiptNumber,
        status: 'PENDING',
      },
    });
  }

  async registerPayment(id: string, dto: RegisterPaymentDto) {
    const payment = await this.findById(id);
    if (payment.status === 'PAID') throw new BadRequestException('Este pago ya fue registrado');

    const html = await this.receiptService.generateReceiptHtml(
      { ...payment, ...dto, paidAt: dto.paidAt || new Date().toISOString() },
      payment.affiliate,
    );
    const receiptUrl = await this.receiptService.saveReceipt(html, payment.receiptNumber);

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: 'PAID',
        method: (dto.method as any) || payment.method,
        reference: dto.reference || payment.reference,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
        notes: dto.notes,
        receiptUrl,
        receiptSentAt: new Date(),
      },
      include: { affiliate: { include: { user: true } } },
    });

    if (updated.affiliate.user) {
      await this.notificationsService.sendPaymentConfirmation(updated.affiliate.user.id, updated);
    }

    return updated;
  }

  async cancel(id: string) {
    const payment = await this.findById(id);
    if (payment.status === 'PAID') throw new BadRequestException('No se puede cancelar un pago ya registrado');
    return this.prisma.payment.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async markOverduePayments() {
    await this.prisma.payment.updateMany({
      where: { status: 'PENDING', dueDate: { lt: new Date() } },
      data: { status: 'OVERDUE' },
    });
  }

  @Cron('0 9 * * *')
  async sendPaymentReminders() {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const pendingPayments = await this.prisma.payment.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lte: threeDaysFromNow, gte: new Date() },
      },
      include: { affiliate: { include: { user: true } } },
    });

    for (const payment of pendingPayments) {
      if (payment.affiliate.user) {
        await this.notificationsService.sendPaymentReminder(payment.affiliate.user.id, payment);
      }
    }
  }

  private async generateReceiptNumber(): Promise<string> {
    const count = await this.prisma.payment.count();
    const year = new Date().getFullYear();
    return `REC-${year}-${String(count + 1).padStart(6, '0')}`;
  }
}
