import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

const OUTCOMES = ['WON', 'LOST'] as const;

export class CloseOpportunityDto {
  @ApiProperty({ enum: OUTCOMES })
  @IsIn(OUTCOMES)
  outcome!: (typeof OUTCOMES)[number];

  @ApiPropertyOptional({ example: 'Presupuesto asignado a otro proveedor' })
  @IsOptional()
  @IsString()
  reason?: string;
}
