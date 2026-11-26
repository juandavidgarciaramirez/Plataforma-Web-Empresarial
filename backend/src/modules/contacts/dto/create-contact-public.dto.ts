import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

const PHONE_REGEX = /^[0-9+()\s-]{7,20}$/;

/** DTO del formulario público "Contáctenos" (sección 22 del encargo). */
export class CreateContactPublicDto {
  @ApiProperty({ example: 'Carlos Ramírez' })
  @IsString()
  @Length(3, 150, { message: 'El nombre es muy corto' })
  nombre!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  empresa?: string;

  @ApiProperty({ example: 'carlos.ramirez@correo.com' })
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(PHONE_REGEX, { message: 'Teléfono inválido' })
  telefono?: string;

  @ApiProperty({ example: 'capital-sst' })
  @IsString()
  @IsNotEmpty({ message: 'Selecciona un servicio de interés' })
  servicioInteres!: string;

  @ApiProperty()
  @IsString()
  @Length(10, 3000, { message: 'El mensaje debe tener al menos 10 caracteres' })
  mensaje!: string;
}
