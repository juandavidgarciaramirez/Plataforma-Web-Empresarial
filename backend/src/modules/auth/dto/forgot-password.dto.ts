import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@capitalconsulting.com' })
  @IsEmail({}, { message: 'email debe ser un correo electrónico válido' })
  email!: string;
}
