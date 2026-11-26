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
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { MediaRefDto } from '../../../media/media.types';
import { VACANCY_MODALITIES, VACANCY_STATUSES, VacancyModality, VacancyStatus } from '../entities/vacancy.entity';

export class CreateVacancyDto {
  @ApiProperty({ example: 'analista-hse-bogota' })
  @IsString()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: 'slug debe ser kebab-case (minúsculas y guiones)' })
  slug!: string;

  @ApiProperty({ example: 'Analista HSE' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'HSE' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Bogotá, Colombia' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: VACANCY_MODALITIES, default: 'ONSITE' })
  @IsOptional()
  @IsIn(VACANCY_MODALITIES)
  modality?: VacancyModality;

  @ApiProperty({ example: 'Descripción de la vacante.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ description: 'Id de la imagen de portada (POST /media/images). null la quita; omitir = sin cambios.' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  imageFileId?: string | null;

  @ApiPropertyOptional({ description: 'Texto alternativo de la imagen de portada.' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  imageAlt?: string | null;

  @ApiPropertyOptional({ type: [MediaRefDto], description: 'Imágenes ilustrativas en orden. [] las quita; omitir = sin cambios.' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => MediaRefDto)
  galleryImages?: MediaRefDto[];

  @ApiPropertyOptional({ enum: VACANCY_STATUSES, default: 'OPEN' })
  @IsOptional()
  @IsIn(VACANCY_STATUSES)
  status?: VacancyStatus;
}
