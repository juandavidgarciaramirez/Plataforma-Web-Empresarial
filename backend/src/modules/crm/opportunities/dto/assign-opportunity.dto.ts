import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignOpportunityDto {
  @ApiProperty({ description: 'Usuario comercial al que se asigna la oportunidad' })
  @IsString()
  ownerUserId!: string;
}
