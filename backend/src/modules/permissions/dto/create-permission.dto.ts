import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'crm.reports.export',
    description:
      'Clave única en formato módulo.recurso.acción (3 partes, formato real de security.permissions — Etapa 2)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z_]+\.[a-z_]+\.[a-z_]+$/, {
    message: 'key debe tener el formato modulo.recurso.accion, en minúsculas (con "_" opcional en acciones compuestas)',
  })
  key!: string;

  @ApiProperty({ example: 'crm' })
  @IsString()
  @IsNotEmpty()
  module!: string;

  @ApiProperty({ example: 'Exportar reportes en PDF/Excel' })
  @IsString()
  @IsNotEmpty()
  description!: string;
}
