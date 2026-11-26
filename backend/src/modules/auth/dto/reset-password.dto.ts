import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token recibido en el correo de recuperación' })
  @IsString()
  @IsNotEmpty({ message: 'token es requerido' })
  token!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'newPassword debe tener al menos 8 caracteres' })
  newPassword!: string;
}
