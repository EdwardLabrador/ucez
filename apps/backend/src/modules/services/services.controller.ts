// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ServicesService } from './services.service';

@ApiTags('Servicios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar servicios' })
  findAll(@Query('page') page = 1, @Query('perPage') perPage = 20, @Query('category') category?: string) {
    return this.servicesService.findAll(+page, +perPage, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener servicio por ID' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Crear servicio' })
  create(@Body() dto: any) {
    return this.servicesService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Actualizar servicio' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Desactivar servicio' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
