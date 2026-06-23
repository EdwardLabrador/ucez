// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Limitar conexiones para respetar el pool de Supabase (max 15 en session mode)
    const url = new URL(process.env.DATABASE_URL!);
    url.searchParams.set('connection_limit', '3');
    url.searchParams.set('pool_timeout', '10');
    super({ datasources: { db: { url: url.toString() } } });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
