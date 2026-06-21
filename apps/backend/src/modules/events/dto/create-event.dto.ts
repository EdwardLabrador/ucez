// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;

  @ApiPropertyOptional({ enum: ['CONFERENCE', 'WORKSHOP', 'MEETING', 'WEBINAR', 'SOCIAL', 'OTHER'] })
  @IsEnum(['CONFERENCE', 'WORKSHOP', 'MEETING', 'WEBINAR', 'SOCIAL', 'OTHER'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() location?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isVirtual?: boolean;
  @ApiPropertyOptional() @IsUrl() @IsOptional() virtualLink?: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() capacity?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() imageUrl?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isPublic?: boolean;
}
