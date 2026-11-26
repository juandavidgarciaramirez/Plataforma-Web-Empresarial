import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CONTENT_STATUSES, ContentStatus } from '../../common/content.types';
import { MediaRefDto } from '../../../media/media.types';

export class CreateServiceDto {
  @ApiProperty({ example: 'capital-nueva-linea' })
  @IsString()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: 'slug debe ser kebab-case (minúsculas y guiones)' })
  slug!: string;

  @ApiProperty({ example: 'Capital Nueva Línea' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Descripción corta para tarjetas y listados.' })
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @ApiProperty({ example: 'Descripción completa de la línea de servicio.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ description: 'Nombre de ícono (lucide-react)' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ description: 'Id de la imagen principal (POST /media/images). null la quita; omitir = sin cambios.' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  imageFileId?: string | null;

  @ApiPropertyOptional({ description: 'Texto alternativo de la imagen principal (accesibilidad y SEO).' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  imageAlt?: string | null;

  @ApiPropertyOptional({ type: [MediaRefDto], description: 'Imágenes ilustrativas adicionales en orden. [] las quita; omitir = sin cambios.' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => MediaRefDto)
  galleryImages?: MediaRefDto[];

  @ApiPropertyOptional({ enum: CONTENT_STATUSES, default: 'DRAFT' })
  @IsOptional()
  @IsIn(CONTENT_STATUSES)
  status?: ContentStatus;
}
