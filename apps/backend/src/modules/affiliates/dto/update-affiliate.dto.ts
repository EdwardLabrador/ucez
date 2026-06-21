// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { PartialType } from '@nestjs/swagger';
import { CreateAffiliateDto } from './create-affiliate.dto';

export class UpdateAffiliateDto extends PartialType(CreateAffiliateDto) {}
