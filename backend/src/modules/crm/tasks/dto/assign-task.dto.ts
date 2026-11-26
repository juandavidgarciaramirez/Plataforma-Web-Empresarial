import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty({ description: 'Usuario al que se asigna la tarea' })
  @IsString()
  assigneeUserId!: string;
}
