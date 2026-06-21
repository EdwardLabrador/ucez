// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
