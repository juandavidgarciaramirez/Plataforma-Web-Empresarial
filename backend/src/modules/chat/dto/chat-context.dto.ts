import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Contexto de conversación (sección 21 del brief). El cliente puede enviarlo
 * en cada request (por ejemplo, tras recargar la página) y el backend lo
 * fusiona con lo que ya tiene guardado para el `sessionId`; también se
 * devuelve actualizado en cada respuesta.
 */
export class ChatContextDto {
  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  company?: string | null;

  @ApiPropertyOptional({ example: 'carlos@empresa.com', nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string | null;

  @ApiPropertyOptional({ example: '+573001234567', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true, description: 'Id del servicio identificado (p. ej. "capital-hse")' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  service?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  intent?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  industry?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  need?: string | null;

  @ApiPropertyOptional({ example: 'conductores', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  problem?: string | null;
}
