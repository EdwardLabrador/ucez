// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, RegisterPaymentDto } from './dto/create-payment.dto';

@ApiTags('Cobros y Pagos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Listar pagos' })
  @ApiQuery({ name: 'affiliateId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
    @Query('affiliateId') affiliateId?: string,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll(+page, +perPage, affiliateId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pago por ID' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Crear registro de cobro' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id/pay')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Registrar pago y generar recibo' })
  registerPayment(@Param('id') id: string, @Body() dto: RegisterPaymentDto) {
    return this.paymentsService.registerPayment(id, dto);
  }

  @Patch(':id/cancel')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Cancelar cobro' })
  cancel(@Param('id') id: string) {
    return this.paymentsService.cancel(id);
  }
}
