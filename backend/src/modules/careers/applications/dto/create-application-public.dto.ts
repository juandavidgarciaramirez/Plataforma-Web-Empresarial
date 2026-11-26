import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, Equals, IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';
import {
  APPLICATION_DOCUMENT_TYPES,
  APPLICATION_EDUCATION_LEVELS,
  APPLICATION_EXPERIENCE_RANGES,
  APPLICATION_EXPERIENCE_SECTORS,
  APPLICATION_REFERRAL_SOURCES,
  APPLICATION_RELOCATION_OPTIONS,
} from '../application.constants';

const PHONE_REGEX = /^[0-9+()\s-]{7,20}$/;
const toBool = (value: unknown) => value === true || value === 'true' || value === 'on';
/** Multer/Nest entregan un solo valor de FormData como string y valores repetidos como array — se normaliza a array siempre. */
const toArray = (value: unknown) => (Array.isArray(value) ? value : value === undefined || value === '' ? [] : [value]);

/**
 * `ValidationPipe` global corre con `transformOptions: { enableImplicitConversion: true }`
 * (main.ts) — para una propiedad `boolean`, eso convierte CUALQUIER string no
 * vacío (incluido literalmente `"false"`) a `true` ANTES de que `@Transform`
 * reciba `value` (detectado probando en vivo: `autorizacionComunicaciones`
 * llegaba siempre en `true` sin importar el valor real enviado). Por eso acá
 * se lee el valor crudo desde `obj[key]` (el objeto plano original), no
 * desde `value` (ya potencialmente corrompido por la conversión implícita).
 */
const toBoolFromRaw = ({ obj, key }: { obj: Record<string, unknown>; key: string }) => toBool(obj[key]);

/**
 * DTO de postulación pública a la "Base de Altos Potenciales" (sección 23
 * del encargo). Llega como `multipart/form-data` (la hoja de vida va aparte,
 * ver `ApplicationsController`). Porteado 1:1 desde el backend duplicado en
 * Next.js (`src/features/careers/dto/create-application.dto.ts`).
 */
export class CreateApplicationPublicDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @Length(3, 150, { message: 'El nombre completo es muy corto' })
  nombreCompleto!: string;

  @ApiProperty({ enum: APPLICATION_DOCUMENT_TYPES })
  @IsIn(APPLICATION_DOCUMENT_TYPES, { message: 'Selecciona un tipo de documento' })
  tipoDocumento!: (typeof APPLICATION_DOCUMENT_TYPES)[number];

  @ApiProperty()
  @IsString()
  @Length(4, 30, { message: 'El número de documento es muy corto' })
  numeroDocumento!: string;

  @ApiProperty()
  @IsString()
  @Matches(PHONE_REGEX, { message: 'Número de celular inválido' })
  celular!: string;

  @ApiProperty({ example: 'juan.perez@correo.com' })
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo!: string;

  @ApiProperty({ example: 'Bogotá, Colombia' })
  @IsString()
  @Length(2, 150, { message: 'Indica tu ciudad y país de residencia' })
  ciudadPais!: string;

  @ApiProperty({ example: 'Analista HSE' })
  @IsString()
  @Length(2, 150, { message: 'Indica el cargo al que deseas postularte' })
  cargoAspirado!: string;

  @ApiProperty({ enum: APPLICATION_EXPERIENCE_RANGES })
  @IsIn(APPLICATION_EXPERIENCE_RANGES, { message: 'Selecciona tus años de experiencia en el cargo' })
  aniosExperiencia!: (typeof APPLICATION_EXPERIENCE_RANGES)[number];

  @ApiProperty({ enum: APPLICATION_EDUCATION_LEVELS })
  @IsIn(APPLICATION_EDUCATION_LEVELS, { message: 'Selecciona tu nivel educativo' })
  nivelEducativo!: (typeof APPLICATION_EDUCATION_LEVELS)[number];

  @ApiProperty({ enum: APPLICATION_RELOCATION_OPTIONS })
  @IsIn(APPLICATION_RELOCATION_OPTIONS, { message: 'Indica tu disponibilidad para viajar o reubicarte' })
  disponibilidad!: (typeof APPLICATION_RELOCATION_OPTIONS)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aspiracionSalarial?: string;

  @ApiPropertyOptional({ enum: APPLICATION_REFERRAL_SOURCES })
  @IsOptional()
  @IsIn(APPLICATION_REFERRAL_SOURCES)
  comoSeEntero?: (typeof APPLICATION_REFERRAL_SOURCES)[number];

  @ApiProperty({ enum: APPLICATION_EXPERIENCE_SECTORS, isArray: true })
  @Transform(({ value }) => toArray(value))
  @IsArray()
  @ArrayMinSize(1, { message: 'Selecciona al menos un sector de experiencia' })
  @IsIn(APPLICATION_EXPERIENCE_SECTORS, { each: true, message: 'Sector de experiencia inválido' })
  sectores!: string[];

  @ApiPropertyOptional({ description: 'Slug de la vacante puntual, si aplica' })
  @IsOptional()
  @IsString()
  vacanteSlug?: string;

  @ApiProperty({ example: true })
  @Transform(toBoolFromRaw)
  @IsBoolean()
  @Equals(true, { message: 'Debes autorizar el tratamiento de datos personales para continuar' })
  autorizacionDatos!: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolFromRaw)
  @IsBoolean()
  autorizacionComunicaciones?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolFromRaw)
  @IsBoolean()
  autorizacionCompartirHV?: boolean;
}
