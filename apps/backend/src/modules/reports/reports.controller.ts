// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('affiliates')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  async affiliates(@Res() res: Response) {
    const csv = await this.reportsService.affiliatesCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="afiliados.csv"');
    res.send('﻿' + csv);
  }

  @Get('payments')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  async payments(
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const csv = await this.reportsService.paymentsCsv(from, to);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pagos.csv"');
    res.send('﻿' + csv);
  }

  @Get('financial-summary')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async financialSummary(@Res() res: Response) {
    const csv = await this.reportsService.financialSummaryCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="resumen-financiero.csv"');
    res.send('﻿' + csv);
  }
}
