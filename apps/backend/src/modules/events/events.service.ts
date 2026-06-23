// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, perPage = 20, status?: string) {
    const skip = (page - 1) * perPage;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: perPage,
        include: { _count: { select: { registrations: true } } },
        orderBy: { startDate: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { data, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { registrations: { include: { affiliate: { select: { businessName: true, email: true } } } } },
    });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  private parseDates(dto: Partial<CreateEventDto>) {
    const data: any = { ...dto };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (data.location === '') delete data.location;
    return data;
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({ data: { ...this.parseDates(dto), status: 'DRAFT' } });
  }

  async update(id: string, dto: Partial<CreateEventDto>) {
    await this.findById(id);
    return this.prisma.event.update({ where: { id }, data: this.parseDates(dto) });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.event.update({ where: { id }, data: { status: 'PUBLISHED' } });
  }

  async cancel(id: string) {
    await this.findById(id);
    return this.prisma.event.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async registerAttendee(eventId: string, affiliateId: string) {
    const event = await this.findById(eventId);
    if (event.status !== 'PUBLISHED') throw new ConflictException('El evento no está disponible para registro');

    const exists = await this.prisma.eventRegistration.findUnique({ where: { eventId_affiliateId: { eventId, affiliateId } } });
    if (exists) throw new ConflictException('Ya está registrado en este evento');

    return this.prisma.eventRegistration.create({ data: { eventId, affiliateId } });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.event.delete({ where: { id } });
  }
}
