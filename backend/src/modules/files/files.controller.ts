import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';
import { diskStorageFor, fileFilterFor, GENERIC_FILE_RULE } from '../../common/utils/file-upload.util';

/**
 * `FileService` real (sección 42/5 del encargo) sobre `foundation.files`
 * (tabla ya existía desde la Etapa 1, no la usaba ningún módulo). Cubre
 * subida/listado/descarga/borrado lógico genérico desde el admin — PQR y
 * Careers siguen guardando su propia ruta como antes (no se retocó ese
 * flujo para no arriesgar una regresión); quedan como candidatos a migrar
 * a este registro central más adelante.
 */
@ApiTags('Archivos')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @Permissions('foundation.files.read')
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiOperation({ summary: 'Listar archivos (no eliminados)' })
  findAll(@Query('entityType') entityType?: string, @Query('entityId') entityId?: string) {
    return this.filesService.findAll({ entityType, entityId });
  }

  @Get(':id')
  @Permissions('foundation.files.read')
  @ApiOperation({ summary: 'Obtener metadata de un archivo' })
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Get(':id/download')
  @Permissions('foundation.files.read')
  @ApiOperation({ summary: 'Descargar el archivo físico' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.findOne(id);
    res.download(this.filesService.absolutePathOf(file), file.originalName);
  }

  @Post()
  @Permissions('foundation.files.create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorageFor('files'),
      fileFilter: fileFilterFor(GENERIC_FILE_RULE),
      limits: { fileSize: GENERIC_FILE_RULE.maxSizeBytes },
    }),
  )
  @ApiOperation({ summary: 'Subir un archivo (registro real en foundation.files)' })
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('description') description: string | undefined,
    @Body('entityType') entityType: string | undefined,
    @Body('entityId') entityId: string | undefined,
    @CurrentUser() user: RequestUser,
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo (campo "archivo")');
    return this.filesService.register(file, 'files', user.email, { description, entityType, entityId });
  }

  @Delete(':id')
  @Permissions('foundation.files.delete')
  @ApiOperation({ summary: 'Eliminar un archivo (borrado lógico; el archivo físico se conserva)' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.filesService.remove(id, user.email);
  }
}
