// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'AFFILIATE'] })
  @IsEnum(['SUPER_ADMIN', 'ADMIN', 'STAFF', 'AFFILIATE'])
  @IsOptional()
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'AFFILIATE';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  affiliateId?: string;
}
