// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { IsString, IsEnum, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;

  @ApiPropertyOptional({ enum: ['LEGAL', 'FINANCIAL', 'TRAINING', 'NETWORKING', 'CONSULTING', 'BENEFITS', 'OTHER'] })
  @IsEnum(['LEGAL', 'FINANCIAL', 'TRAINING', 'NETWORKING', 'CONSULTING', 'BENEFITS', 'OTHER'])
  @IsOptional()
  category?: string;

  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() imageUrl?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() contactInfo?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() externalLink?: string;
}
