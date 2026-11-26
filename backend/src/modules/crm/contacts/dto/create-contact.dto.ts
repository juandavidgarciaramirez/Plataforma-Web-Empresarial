import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Laura Gómez' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'laura.gomez@empresa.com' })
  @IsOptional()
  @IsEmail({}, { message: 'email debe ser un correo electrónico válido' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Gerente de Operaciones' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: 'Empresa a la que pertenece el contacto' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Usuario comercial dueño del contacto' })
  @IsOptional()
  @IsString()
  ownerUserId?: string;
}
