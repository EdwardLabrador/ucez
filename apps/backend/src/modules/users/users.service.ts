// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take: perPage, select: this.safeSelect(), orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count(),
    ]);
    return { data, meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('El correo ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: { ...dto, password: hashed },
      select: this.safeSelect(),
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOrFail(id);
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.update({ where: { id }, data: dto, select: this.safeSelect() });
  }

  async remove(id: string) {
    await this.findOrFail(id);
    return this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
      select: this.safeSelect(),
    });
  }

  private async findOrFail(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  private safeSelect() {
    return { id: true, email: true, name: true, role: true, status: true, affiliateId: true, lastLoginAt: true, createdAt: true, updatedAt: true };
  }
}
