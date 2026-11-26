import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CONTENT_STATUSES, ContentStatus } from '../../common/content.types';
import { MediaRefDto } from '../../../media/media.types';

export class CreateNewsDto {
  @ApiProperty({ example: 'capital-consulting-amplia-operacion' })
  @IsString()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: 'slug debe ser kebab-case (minúsculas y guiones)' })
  slug!: string;

  @ApiProperty({ example: 'Capital Consulting amplía su operación' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Resumen breve para listados.' })
  @IsString()
  @IsNotEmpty()
  summary!: string;

  @ApiProperty({ example: 'Cuerpo completo de la noticia.' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ example: 'Corporativo' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: 'Id de la imagen principal (POST /media/images). null la quita; omitir = sin cambios.' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  coverImageFileId?: string | null;

  @ApiPropertyOptional({ description: 'Texto alternativo de la imagen principal (accesibilidad y SEO).' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  imageAlt?: string | null;

  @ApiPropertyOptional({ type: [MediaRefDto], description: 'Imágenes adicionales en orden. [] las quita todas; omitir = sin cambios.' })
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
