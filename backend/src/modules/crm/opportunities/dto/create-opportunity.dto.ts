import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { OPPORTUNITY_STAGES, OpportunityStage } from '../entities/opportunity.entity';

export class CreateOpportunityDto {
  @ApiProperty({ example: 'Implementación Capital HSE — Transportes del Norte' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiPropertyOptional({ default: 'COP' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: OPPORTUNITY_STAGES, default: 'NEW' })
  @IsOptional()
  @IsIn(OPPORTUNITY_STAGES)
  stage?: OpportunityStage;

  @ApiPropertyOptional({ minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number;

  @ApiPropertyOptional({ description: 'Usuario comercial dueño de la oportunidad' })
  @IsOptional()
  @IsString()
  ownerUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;

  @ApiPropertyOptional({ description: 'Lead del que se originó, si aplica' })
  @IsOptional()
  @IsString()
  sourceLeadId?: string;
}
