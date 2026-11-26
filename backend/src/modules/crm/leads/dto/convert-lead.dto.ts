import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ConvertLeadDto {
  @ApiPropertyOptional({ description: 'Título de la oportunidad (por defecto, se deriva del lead)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiPropertyOptional({ description: 'Empresa a asociar a la oportunidad, si ya existe en el CRM' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Contacto a asociar a la oportunidad, si ya existe en el CRM' })
  @IsOptional()
  @IsString()
  contactId?: string;
}
