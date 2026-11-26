import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Rango de fechas en la zona horaria del negocio (ANALYTICS_TIMEZONE, por defecto America/Bogota), ambos días incluidos. */
export class DateRangeQueryDto {
  @ApiProperty({ example: '2026-10-01' })
  @Matches(DATE, { message: 'from debe tener el formato AAAA-MM-DD' })
  from!: string;

  @ApiProperty({ example: '2026-10-29' })
  @Matches(DATE, { message: 'to debe tener el formato AAAA-MM-DD' })
  to!: string;
}

export class ReportQueryDto extends DateRangeQueryDto {
  @ApiPropertyOptional({ default: true, description: 'Incluir el periodo anterior de igual duración para comparar' })
  @IsOptional()
  // Se lee el valor crudo (`obj`): la conversión implícita global convertiría "false" en true.
  @Transform(({ obj }) => {
    const raw = (obj as Record<string, unknown>).compare;
    return raw === true || raw === 'true' || raw === '1';
  })
  @IsBoolean()
  compare?: boolean;
}

export class PagesQueryDto extends DateRangeQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Filtrar por texto contenido en la ruta' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}

export const EXPORT_REPORTS = ['daily', 'pages', 'sources', 'campaigns', 'devices', 'events'] as const;
export type ExportReport = (typeof EXPORT_REPORTS)[number];

export class ExportQueryDto extends DateRangeQueryDto {
  @ApiProperty({ enum: EXPORT_REPORTS })
  @IsIn(EXPORT_REPORTS)
  report!: ExportReport;
}
