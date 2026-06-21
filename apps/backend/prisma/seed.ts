// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Ejecutando seed...');

  const password = await bcrypt.hash('Admin1234!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@ucez.com' },
    update: {},
    create: { email: 'superadmin@ucez.com', password, name: 'Super Administrador', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ucez.com' },
    update: {},
    create: { email: 'admin@ucez.com', password, name: 'Administrador', role: 'ADMIN', status: 'ACTIVE' },
  });

  const affiliate = await prisma.affiliate.upsert({
    where: { ruc: '0991234567001' },
    update: {},
    create: {
      businessName: 'Empresa Demo S.A.',
      ruc: '0991234567001',
      sector: 'Tecnología',
      membershipStatus: 'ACTIVE',
      membershipPlan: 'STANDARD',
      membershipStartDate: new Date('2024-01-01'),
      address: 'Av. Principal 123',
      city: 'Guayaquil',
      phone: '0999000000',
      email: 'demo@empresa.com',
      representativeName: 'Juan Pérez',
      representativeEmail: 'juan@empresa.com',
      representativePhone: '0999000001',
    },
  });

  await prisma.user.upsert({
    where: { email: 'afiliado@empresa.com' },
    update: {},
    create: {
      email: 'afiliado@empresa.com',
      password,
      name: 'Juan Pérez',
      role: 'AFFILIATE',
      status: 'ACTIVE',
      affiliateId: affiliate.id,
    },
  });

  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      { title: 'Asesoría Legal Empresarial', description: 'Consultoría jurídica gratuita para afiliados.', category: 'LEGAL', isActive: true },
      { title: 'Capacitaciones y Talleres', description: 'Programas de formación continua para empresarios.', category: 'TRAINING', isActive: true },
      { title: 'Red de Networking', description: 'Conexión con otros empresarios del sector.', category: 'NETWORKING', isActive: true },
    ],
  });

  await prisma.event.createMany({
    skipDuplicates: true,
    data: [
      { title: 'Asamblea General Anual', description: 'Reunión anual de afiliados para revisión de resultados.', type: 'MEETING', status: 'PUBLISHED', startDate: new Date('2026-07-15T09:00:00'), endDate: new Date('2026-07-15T12:00:00'), isPublic: true },
      { title: 'Taller de Emprendimiento Digital', description: 'Workshop sobre transformación digital para PyMEs.', type: 'WORKSHOP', status: 'PUBLISHED', startDate: new Date('2026-07-22T14:00:00'), endDate: new Date('2026-07-22T17:00:00'), isVirtual: true, isPublic: true },
    ],
  });

  console.log('Seed completado.');
  console.log('Usuarios creados:');
  console.log('  superadmin@ucez.com / Admin1234!');
  console.log('  admin@ucez.com / Admin1234!');
  console.log('  afiliado@empresa.com / Admin1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
