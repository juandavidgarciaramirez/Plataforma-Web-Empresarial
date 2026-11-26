import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: '30' })
  @IsString()
  @IsNotEmpty()
  value!: string;
}
