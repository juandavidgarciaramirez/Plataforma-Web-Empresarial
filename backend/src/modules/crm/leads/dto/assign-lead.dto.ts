import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignLeadDto {
  @ApiProperty({ description: 'Usuario comercial al que se asigna el lead' })
  @IsString()
  ownerUserId!: string;
}
