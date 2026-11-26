import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

const STATUSES = ['ACTIVE', 'INACTIVE'] as const;
const ORG_LEVELS = [1, 2, 3] as const;
const CONNECTOR_CURVES = ['left', 'right'] as const;

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'María Fernanda López' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Gerente General' })
  @IsString()
  @IsNotEmpty()
  position!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  photoUrl?: string;

  @ApiPropertyOptional({ description: 'Id de la fotografía subida (POST /media/images). null la quita; omitir = sin cambios.' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  photoFileId?: string | null;

  @ApiPropertyOptional({ description: 'Texto alternativo de la fotografía (accesibilidad y SEO).' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  photoAlt?: string | null;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ enum: STATUSES, default: 'ACTIVE' })
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];

  @ApiPropertyOptional({ example: 'Contadora Pública', description: 'Profesión / formación de base.' })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional({ example: 'Dirección General', description: 'Línea o área mostrada como badge.' })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({ example: 'capital-hse', description: 'Código de la línea de servicio (catalog.services.code).' })
  @IsOptional()
  @IsString()
  serviceCode?: string;

  @ApiPropertyOptional({ type: [String], example: ['Gestión financiera', 'NIIF'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  specialties?: string[];

  @ApiPropertyOptional({ type: [String], example: ['ISO 9001', 'ISO 45001'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({ example: 'Auditora Líder' })
  @IsOptional()
  @IsString()
  certificationsLabel?: string;

  @ApiPropertyOptional({ default: false, description: 'Perfil transversal (no depende de una sola línea de negocio).' })
  @IsOptional()
  @IsBoolean()
  isTransversal?: boolean;

  @ApiPropertyOptional({ enum: ORG_LEVELS, description: 'Nivel del organigrama. Omitir si no aparece en el organigrama.' })
  @IsOptional()
  @IsIn(ORG_LEVELS)
  orgLevel?: (typeof ORG_LEVELS)[number];

  @ApiPropertyOptional({ description: 'Id del integrante del que depende jerárquicamente.' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ enum: CONNECTOR_CURVES, description: 'Curvatura del conector en el organigrama.' })
  @IsOptional()
  @IsIn(CONNECTOR_CURVES)
  connectorCurve?: (typeof CONNECTOR_CURVES)[number];
}
