// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('Eventos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar eventos' })
  findAll(@Query('page') page = 1, @Query('perPage') perPage = 20, @Query('status') status?: string) {
    return this.eventsService.findAll(+page, +perPage, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento por ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Crear evento' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Actualizar evento' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateEventDto>) {
    return this.eventsService.update(id, dto);
  }

  @Patch(':id/publish')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Publicar evento' })
  publish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Cancelar evento' })
  cancel(@Param('id') id: string) {
    return this.eventsService.cancel(id);
  }

  @Post(':id/register/:affiliateId')
  @ApiOperation({ summary: 'Registrar asistencia al evento' })
  registerAttendee(@Param('id') id: string, @Param('affiliateId') affiliateId: string) {
    return this.eventsService.registerAttendee(id, affiliateId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Eliminar evento' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
