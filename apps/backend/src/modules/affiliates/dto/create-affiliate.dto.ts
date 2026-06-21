// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { IsString, IsEmail, IsEnum, IsOptional, IsDateString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAffiliateDto {
  @ApiProperty() @IsString() businessName: string;
  @ApiPropertyOptional() @IsString() @IsOptional() tradeName?: string;
  @ApiProperty() @IsString() ruc: string;
  @ApiProperty() @IsString() sector: string;
  @ApiPropertyOptional() @IsString() @IsOptional() category?: string;

  @ApiPropertyOptional({ enum: ['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'] })
  @IsEnum(['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'])
  @IsOptional()
  membershipPlan?: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

  @ApiProperty() @IsDateString() membershipStartDate: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() membershipEndDate?: string;

  @ApiProperty() @IsString() address: string;
  @ApiProperty() @IsString() city: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsUrl() @IsOptional() website?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;

  @ApiProperty() @IsString() representativeName: string;
  @ApiProperty() @IsEmail() representativeEmail: string;
  @ApiProperty() @IsString() representativePhone: string;
}
