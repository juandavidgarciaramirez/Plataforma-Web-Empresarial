import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO restringido para la captura pública de leads (sección 31 del brief:
 * Contacto → CRM). A propósito NO expone `source`, `status`, `ownerUserId`
 * ni `notes` libres de auditoría — eso solo lo maneja un admin autenticado
 * vía `POST /crm/leads`.
 */
export class CapturePublicLeadDto {
  @ApiProperty({ example: 'Carlos Ramírez' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'email debe ser un correo electrónico válido' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: 'capital-sst' })
  @IsOptional()
  @IsString()
  serviceInterest?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
