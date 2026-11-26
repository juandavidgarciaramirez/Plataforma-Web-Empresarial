import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PQR_STATUSES, PqrStatus } from '../entities/pqr.entity';

export class UpdatePqrDto {
  @ApiPropertyOptional({ enum: PQR_STATUSES })
  @IsOptional()
  @IsIn(PQR_STATUSES)
  status?: PqrStatus;

  @ApiPropertyOptional({ description: 'Respuesta que se envía al ciudadano' })
  @IsOptional()
  @IsString()
  response?: string;
}
