import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const SIZE_SEGMENTS = ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'] as const;
const STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export class CreateCompanyDto {
  @ApiProperty({ example: 'Transportes del Norte S.A.S.' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: '900123456-7' })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ example: 'Transporte y logística' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ enum: SIZE_SEGMENTS })
  @IsOptional()
  @IsIn(SIZE_SEGMENTS)
  sizeSegment?: (typeof SIZE_SEGMENTS)[number];

  @ApiPropertyOptional({ example: 'https://empresa.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Usuario comercial dueño de la cuenta' })
  @IsOptional()
  @IsString()
  ownerUserId?: string;

  @ApiPropertyOptional({ enum: STATUSES, default: 'ACTIVE' })
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];
}
