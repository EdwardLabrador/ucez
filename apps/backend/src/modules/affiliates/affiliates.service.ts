// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';

@Injectable()
export class AffiliatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, perPage = 20, search?: string, status?: string) {
    const skip = (page - 1) * perPage;
    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { ruc: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.membershipStatus = status;

    const [data, total] = await Promise.all([
      this.prisma.affiliate.findMany({
        where,
        skip,
        take: perPage,
        include: { contacts: true, _count: { select: { payments: true } } },
        orderBy: { businessName: 'asc' },
      }),
      this.prisma.affiliate.count({ where }),
    ]);

    return { data, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findById(id: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { id },
      include: {
        contacts: true,
        documents: true,
        payments: { orderBy: { dueDate: 'desc' }, take: 12 },
        user: { select: { id: true, email: true, status: true, lastLoginAt: true } },
      },
    });
    if (!affiliate) throw new NotFoundException('Afiliado no encontrado');
    return affiliate;
  }

  async create(dto: CreateAffiliateDto) {
    const existing = await this.prisma.affiliate.findUnique({ where: { ruc: dto.ruc } });
    if (existing) throw new ConflictException('Ya existe un afiliado con ese RUC');

    return this.prisma.affiliate.create({ data: { ...dto, membershipStatus: 'PENDING' } });
  }

  async update(id: string, dto: UpdateAffiliateDto) {
    await this.findById(id);
    const data: any = { ...dto };
    if (data.membershipStartDate) data.membershipStartDate = new Date(data.membershipStartDate);
    if (data.membershipEndDate) data.membershipEndDate = new Date(data.membershipEndDate);
    try {
      return await this.prisma.affiliate.update({ where: { id }, data });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Ya existe un afiliado con ese RUC');
      throw e;
    }
  }

  async updateStatus(id: string, status: string) {
    await this.findById(id);
    return this.prisma.affiliate.update({
      where: { id },
      data: { membershipStatus: status as any },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.affiliate.update({
      where: { id },
      data: { isActive: false, membershipStatus: 'INACTIVE' },
    });
  }

  async getAccountStatement(id: string) {
    await this.findById(id);
    const payments = await this.prisma.payment.findMany({
      where: { affiliateId: id },
      orderBy: { dueDate: 'desc' },
    });

    const totalPaid = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + Number(p.amount), 0);
    const totalPending = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + Number(p.amount), 0);
    const totalOverdue = payments.filter(p => p.status === 'OVERDUE').reduce((s, p) => s + Number(p.amount), 0);

    return { totalPaid, totalPending, totalOverdue, payments };
  }
}
