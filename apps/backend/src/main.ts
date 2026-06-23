// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  }));

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('UCEZ API')
    .setDescription('API de la plataforma de la Cámara de Comercio')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/v1/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend corriendo en http://localhost:${port}`);
  console.log(`Documentación API: http://localhost:${port}/api/docs`);
}

bootstrap();
