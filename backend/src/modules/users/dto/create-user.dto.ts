import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ana Martínez' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ana.martinez@capitalconsulting.com' })
  @IsEmail({}, { message: 'email debe ser un correo electrónico válido' })
  email!: string;

  @ApiPropertyOptional({ example: '3011234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'S3guraP4ss!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'password debe tener al menos 8 caracteres' })
  password!: string;

  @ApiProperty({ description: 'id del rol asignado (security.roles.id es bigint)', example: '3' })
  @IsNumberString({ no_symbols: true })
  roleId!: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';
}
