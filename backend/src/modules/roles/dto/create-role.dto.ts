import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ACCOUNTING' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Gestión contable y financiera' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  /**
   * Solo se valida el formato `modulo.recurso.accion`. La fuente de verdad es
   * `security.permissions`, que tiene claves heredadas fuera de PERMISSION_KEYS:
   * validar contra esa lista impedía editar cualquier rol que tuviera alguna.
   * El repositorio solo enlaza claves que existan en la tabla.
   */
  @ApiProperty({ type: [String], example: ['crm.leads.read', 'crm.leads.update'] })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[a-z_]+\.[a-z_]+\.[a-z_]+$/, { each: true, message: 'cada permiso debe tener el formato modulo.recurso.accion' })
  permissionKeys!: string[];
}
