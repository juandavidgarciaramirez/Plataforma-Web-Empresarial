import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Equals, IsBoolean, IsEmail, IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';
import { PQR_DOCUMENT_TYPES, PQR_TYPES } from '../entities/pqr.entity';

const PHONE_REGEX = /^[0-9+()\s-]{7,20}$/;

/**
 * `ValidationPipe` global corre con `enableImplicitConversion: true`
 * (main.ts) — para una propiedad `boolean`, eso convierte CUALQUIER string
 * no vacío (incluido literalmente `"false"`) a `true` ANTES de que
 * `@Transform` reciba `value`. Por eso se lee el valor crudo desde
 * `obj[key]` (el objeto plano original), no desde `value` — ver el mismo
 * fix en `create-application-public.dto.ts`.
 */
const toBoolFromRaw = ({ obj, key }: { obj: Record<string, unknown>; key: string }) =>
  obj[key] === true || obj[key] === 'true' || obj[key] === 'on';

/**
 * DTO de radicación pública de PQR (sección 21 del encargo). Llega como
 * `multipart/form-data` (el adjunto va aparte, ver `PqrController`), por eso
 * los booleans/strings se normalizan con `@Transform` — igual que hacía
 * `src/features/pqr` en el backend duplicado que este endpoint reemplaza.
 */
export class CreatePqrPublicDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @Length(3, 150, { message: 'El nombre completo es muy corto' })
  nombreCompleto!: string;

  @ApiPropertyOptional({ enum: PQR_DOCUMENT_TYPES })
  @IsOptional()
  @IsIn(PQR_DOCUMENT_TYPES, { message: 'Tipo de documento inválido' })
  tipoDocumento?: (typeof PQR_DOCUMENT_TYPES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numeroDocumento?: string;

  @ApiProperty({ example: 'juan.perez@correo.com' })
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(PHONE_REGEX, { message: 'Teléfono inválido' })
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  empresa?: string;

  @ApiProperty({ enum: PQR_TYPES })
  @IsIn(PQR_TYPES, { message: 'Selecciona un tipo de solicitud válido' })
  tipoSolicitud!: (typeof PQR_TYPES)[number];

  @ApiProperty({ example: 'Solicitud de certificación' })
  @IsString()
  @Length(5, 200, { message: 'El asunto es muy corto' })
  asunto!: string;

  @ApiProperty()
  @IsString()
  @Length(20, 3000, { message: 'La descripción debe tener al menos 20 caracteres' })
  descripcion!: string;

  @ApiProperty({ example: true })
  @Transform(toBoolFromRaw)
  @IsBoolean()
  @Equals(true, { message: 'Debes autorizar el tratamiento de datos personales' })
  consentimiento!: boolean;
}
