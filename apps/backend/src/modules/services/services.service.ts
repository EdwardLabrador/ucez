// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, perPage = 20, category?: string) {
    const skip = (page - 1) * perPage;
    const where: any = { isActive: true };
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({ where, skip, take: perPage, orderBy: { title: 'asc' } }),
      this.prisma.service.count({ where }),
    ]);

    return { data, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findById(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    return service;
  }

  private cleanDto(dto: any) {
    const data: any = { ...dto };
    for (const key of ['contactInfo', 'externalLink', 'imageUrl']) {
      if (data[key] === '') delete data[key];
    }
    return data;
  }

  async create(dto: any) {
    return this.prisma.service.create({ data: this.cleanDto(dto) });
  }

  async update(id: string, dto: any) {
    await this.findById(id);
    return this.prisma.service.update({ where: { id }, data: this.cleanDto(dto) });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.service.update({ where: { id }, data: { isActive: false } });
  }
}
