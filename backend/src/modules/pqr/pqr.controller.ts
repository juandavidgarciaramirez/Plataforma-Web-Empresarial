import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { readFile, unlink } from 'fs/promises';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PqrService } from './pqr.service';
import { CreatePqrPublicDto } from './dto/create-pqr-public.dto';
import { UpdatePqrDto } from './dto/update-pqr.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';
import {
  PQR_ATTACHMENT_RULE,
  diskStorageFor,
  fileFilterFor,
  relativeUploadPath,
} from '../../common/utils/file-upload.util';
import { FilesService } from '../files/files.service';

/**
 * Las PQR las radica el ciudadano desde el sitio público (`POST`/`GET
 * :radicado`, sin sesión) — el resto de endpoints son de gestión interna
 * (Admin). Etapa 3 (2026-08-26): antes el `POST` público vivía en un
 * segundo backend (Next.js, `src/features/pqr`) — se retiró esa duplicación
 * y esta es ahora la única implementación real (regla 7 del encargo).
 */
@ApiTags('PQR')
@Controller('pqr')
export class PqrController {
  constructor(
    private readonly pqrService: PqrService,
    private readonly filesService: FilesService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Radicar una PQR (público, sección 21 del encargo)' })
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorageFor('pqr'),
      fileFilter: fileFilterFor(PQR_ATTACHMENT_RULE),
      limits: { fileSize: PQR_ATTACHMENT_RULE.maxSizeBytes },
    }),
  )
  async createPublic(@Body() dto: CreatePqrPublicDto, @UploadedFile() file?: Express.Multer.File) {
    const attachmentUrl = file ? relativeUploadPath('pqr', file.filename) : null;

    if (file) {
      let buffer: Buffer;

      try {
        buffer = await readFile(file.path);
      } catch {
        await unlink(file.path).catch(() => undefined);
        throw new BadRequestException('No se pudo leer el archivo enviado.');
      }

      const extension = file.filename.split('.').pop()?.toLowerCase();
      let validSignature = false;

      if (extension === 'pdf') {
        validSignature = buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-';
      } else if (extension === 'png') {
        validSignature = buffer.length >= 8 && buffer.subarray(0, 8).equals(
          Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])
        );
      } else if (extension === 'jpg' || extension === 'jpeg') {
        validSignature = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      }

      const extensionAllowed = PQR_ATTACHMENT_RULE.allowedExtensions.includes(extension ?? '');

      if (!extensionAllowed || !validSignature) {
        await unlink(file.path).catch(() => undefined);
        throw new BadRequestException(
          'El contenido real del archivo no coincide con el formato declarado.',
        );
      }
    }

    const created = await this.pqrService.createPublic(dto, attachmentUrl);

    if (file) {
      // Etapa 14: PqrModule ya usa PrismaPqrRepository (pqr.requests es real) — el adjunto se registra en
      // foundation.files y se enlaza por FK real vía pqr.request_attachments (linkAttachment).
      const registered = await this.filesService.register(file, 'pqr', dto.correo, {
        entityType: 'pqr',
        entityId: created.id,
        description: `Adjunto de PQR ${created.radicado}`,
      });
      await this.pqrService.linkAttachment(created.id, registered.id);
    }

    return { radicado: created.radicado, status: created.status, createdAt: created.createdAt };
  }

  /**
   * Antes era `GET /pqr/:id` (Admin, por id interno) — sin uso real desde el
   * frontend (`src/services/pqr.service.ts` nunca lo llamaba). Se reconvirtió
   * a la consulta pública por radicado que sí necesita el sitio público
   * (`GET /api/v1/pqr/:radicado`, sección 21), sin perder ninguna
   * funcionalidad real existente.
   */
  @Public()
  @Get(':radicado')
  @ApiOperation({ summary: 'Consultar una PQR por radicado (público)' })
  findByRadicado(@Param('radicado') radicado: string) {
    return this.pqrService.findByRadicado(radicado);
  }

  @Get()
  @ApiBearerAuth()
  @Permissions('pqrs.tickets.read')
  @ApiOperation({ summary: 'Listar PQR (Admin)' })
  findAll() {
    return this.pqrService.findAll();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Permissions('pqrs.tickets.update')
  @ApiOperation({ summary: 'Actualizar estado o respuesta de una PQR (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdatePqrDto, @CurrentUser() user: RequestUser) {
    return this.pqrService.update(id, dto, user.email);
  }
}
