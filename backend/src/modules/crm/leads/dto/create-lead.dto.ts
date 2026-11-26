import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LEAD_SOURCES, LEAD_STATUSES, LeadSource, LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty({ example: 'Carlos Ramírez' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'carlos.ramirez@empresa.com' })
  @IsOptional()
  @IsEmail({}, { message: 'email debe ser un correo electrónico válido' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Transportes del Norte S.A.S.' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ enum: LEAD_SOURCES, default: 'MANUAL' })
  @IsOptional()
  @IsIn(LEAD_SOURCES)
  source?: LeadSource;

  @ApiPropertyOptional({ example: 'capital-hse' })
  @IsOptional()
  @IsString()
  serviceInterest?: string;

  @ApiPropertyOptional({ enum: LEAD_STATUSES, default: 'NEW' })
  @IsOptional()
  @IsIn(LEAD_STATUSES)
  status?: LeadStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
