// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AffiliatesService } from './affiliates.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';

@ApiTags('Afiliados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('affiliates')
export class AffiliatesController {
  constructor(private affiliatesService: AffiliatesService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Listar afiliados' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.affiliatesService.findAll(+page, +perPage, search, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener afiliado por ID' })
  findOne(@Param('id') id: string) {
    return this.affiliatesService.findById(id);
  }

  @Get(':id/account-statement')
  @ApiOperation({ summary: 'Estado de cuenta del afiliado' })
  getAccountStatement(@Param('id') id: string) {
    return this.affiliatesService.getAccountStatement(id);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Registrar afiliado' })
  create(@Body() dto: CreateAffiliateDto) {
    return this.affiliatesService.create(dto);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Actualizar afiliado' })
  update(@Param('id') id: string, @Body() dto: UpdateAffiliateDto) {
    return this.affiliatesService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Cambiar estatus de membresía' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.affiliatesService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Dar de baja afiliado (baja lógica)' })
  remove(@Param('id') id: string) {
    return this.affiliatesService.remove(id);
  }
}
