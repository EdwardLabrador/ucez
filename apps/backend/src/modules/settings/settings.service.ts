// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULTS: { key: string; value: string; label: string; group: string }[] = [
  { key: 'platform_name',        value: 'UCEZ - Unión de Comerciantes del Estado Zulia', label: 'Nombre de la Plataforma', group: 'general' },
  { key: 'contact_email',        value: 'info@ucez.com',            label: 'Correo de Contacto',          group: 'general' },
  { key: 'contact_phone',        value: '(0261) 000-0000',          label: 'Teléfono de Contacto',        group: 'general' },
  { key: 'address',              value: 'Av. 5 de Julio, Maracaibo, Estado Zulia', label: 'Dirección', group: 'general' },
  { key: 'bank_name',            value: 'Banco de Venezuela',       label: 'Nombre del Banco',            group: 'payment' },
  { key: 'bank_account',         value: '0102-0000-00-0000000000',  label: 'Número de Cuenta',            group: 'payment' },
  { key: 'bank_account_type',    value: 'Corriente',                label: 'Tipo de Cuenta',              group: 'payment' },
  { key: 'bank_account_holder',  value: 'UCEZ, RIF: J-00000000-0', label: 'Titular de la Cuenta',       group: 'payment' },
  { key: 'pago_movil_bank',      value: 'Banco de Venezuela',       label: 'Banco Pago Móvil',           group: 'payment' },
  { key: 'pago_movil_phone',     value: '0261-0000000',             label: 'Teléfono Pago Móvil',        group: 'payment' },
  { key: 'pago_movil_rif',       value: 'J-00000000-0',            label: 'RIF Pago Móvil',             group: 'payment' },
  { key: 'price_basic',          value: '25.00',                    label: 'Precio Plan Básico (USD)',    group: 'plans' },
  { key: 'price_standard',       value: '50.00',                    label: 'Precio Plan Estándar (USD)', group: 'plans' },
  { key: 'price_premium',        value: '100.00',                   label: 'Precio Plan Premium (USD)',  group: 'plans' },
  { key: 'price_enterprise',     value: '200.00',                   label: 'Precio Plan Empresarial (USD)', group: 'plans' },
  { key: 'smtp_from_name',       value: 'UCEZ - Cámara de Comercio', label: 'Nombre remitente email',   group: 'email' },
  { key: 'smtp_from_email',      value: 'noreply@ucez.com',         label: 'Email remitente',            group: 'email' },
];

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    for (const s of DEFAULTS) {
      await this.prisma.setting.upsert({
        where: { key: s.key },
        create: s,
        update: {},
      });
    }
  }

  async getAll() {
    const settings = await this.prisma.setting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
    const grouped: Record<string, any[]> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = [];
      grouped[s.group].push(s);
    }
    return grouped;
  }

  async getByKey(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  async getValue(key: string): Promise<string> {
    const s = await this.prisma.setting.findUnique({ where: { key } });
    return s?.value ?? '';
  }

  async updateMany(updates: { key: string; value: string }[]) {
    const results = await Promise.all(
      updates.map((u) =>
        this.prisma.setting.update({ where: { key: u.key }, data: { value: u.value } }),
      ),
    );
    return results;
  }
}
