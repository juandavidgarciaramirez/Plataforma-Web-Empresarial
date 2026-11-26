import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ minLength: 8, description: 'Si se envía, se re-hashea la contraseña' })
  declare password?: string;
}
