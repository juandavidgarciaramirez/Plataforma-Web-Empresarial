import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@capitalconsulting.com' })
  @IsEmail({}, { message: 'email debe ser un correo electrónico válido' })
  email!: string;

  @ApiProperty({ example: 'Admin123!' })
  @IsString()
  @IsNotEmpty({ message: 'password es requerido' })
  password!: string;
}
