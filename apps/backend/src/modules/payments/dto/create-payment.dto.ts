// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty() @IsString() affiliateId: string;
  @ApiProperty() @IsNumber() @Min(0) amount: number;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
  @ApiProperty() @IsString() period: string;
  @ApiProperty() @IsDateString() dueDate: string;

  @ApiPropertyOptional({ enum: ['CASH', 'TRANSFER', 'DEPOSIT', 'CARD', 'CHECK', 'OTHER'] })
  @IsEnum(['CASH', 'TRANSFER', 'DEPOSIT', 'CARD', 'CHECK', 'OTHER'])
  @IsOptional()
  method?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() reference?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}

export class RegisterPaymentDto {
  @ApiPropertyOptional({ enum: ['CASH', 'TRANSFER', 'DEPOSIT', 'CARD', 'CHECK', 'OTHER'] })
  @IsEnum(['CASH', 'TRANSFER', 'DEPOSIT', 'CARD', 'CHECK', 'OTHER'])
  @IsOptional()
  method?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() reference?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() paidAt?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}
