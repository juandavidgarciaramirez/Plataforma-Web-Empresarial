import {
  ArgumentsHost,
  Body,
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  HttpException,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { MediaService } from './media.service';
import { CAREERS_PAGE_ENTITY_ID, MEDIA_UPLOAD_HARD_LIMIT_BYTES } from './media.config';
import { MediaRefDto, PublicImage, toPublicImage } from './media.types';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';
import { apiError } from '../../common/dto/api-response.dto';

/** Traduce los errores propios de Multer (en inglés) al mismo envelope del resto de la API. */
@Catch(HttpException)
class UploadErrorFilter implements ExceptionFilter {
  private static readonly MESSAGES: Record<string, string> = {
    'File too large': 'La imagen supera el tamaño máximo permitido.',
    'Unexpected field': 'Campo de archivo inesperado: envía la imagen en el campo "archivo".',
    'Too many files': 'Solo se puede subir una imagen por solicitud.',
  };

  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const body = exception.getResponse();
    const raw = typeof body === 'string' ? body : (body as { message?: string | string[] }).message;
    const errors = Array.isArray(raw) ? raw : [];
    const message = Array.isArray(raw) ? 'Error de validación' : (UploadErrorFilter.MESSAGES[raw ?? ''] ?? raw ?? 'Error al subir la imagen');
    response.status(exception.getStatus()).json(apiError(message, errors));
  }
}

const CAREERS_PAGE_SLOTS = ['hero', 'talent', 'growth'] as const;
type CareersPageSlot = (typeof CAREERS_PAGE_SLOTS)[number];

export class UpdateCareersPageImagesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaRefDto)
  hero?: MediaRefDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaRefDto)
  talent?: MediaRefDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaRefDto)
  growth?: MediaRefDto | null;
}

@ApiTags('Imágenes del CMS')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('rules')
  @ApiOperation({ summary: 'Formatos, tamaños y cantidades permitidas por sección (para validar en el formulario)' })
  rules() {
    return this.mediaService.getRules();
  }

  @Post('images')
  @UseFilters(UploadErrorFilter)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['archivo', 'context', 'slot'],
      properties: {
        archivo: { type: 'string', format: 'binary' },
        context: { type: 'string', example: 'news' },
        slot: { type: 'string', example: 'cover' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('archivo', {
      // En memoria: el contenido se valida ANTES de escribir nada en disco.
      // El límite configurable (MEDIA_MAX_IMAGE_MB) lo aplica MediaService con
      // un mensaje detallado; Multer solo corta lo que excede el tope duro.
      storage: memoryStorage(),
      limits: { fileSize: MEDIA_UPLOAD_HARD_LIMIT_BYTES, files: 1, fields: 4, fieldSize: 1024 },
    }),
  )
  @ApiOperation({ summary: 'Subir una imagen (JPG, PNG, WebP o AVIF) para una sección del CMS' })
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('context') context: string | undefined,
    @Body('slot') slot: string | undefined,
    @CurrentUser() user: RequestUser,
  ) {
    return this.mediaService.uploadImage(file, context, slot, user);
  }

  @Get('careers-page')
  @Permissions('jobs.vacancies.read')
  @ApiOperation({ summary: 'Imágenes de la sección pública Trabaja con nosotros' })
  async careersPage() {
    const images = await this.mediaService.loadForEntity('careers_page', CAREERS_PAGE_ENTITY_ID);
    return Object.fromEntries(CAREERS_PAGE_SLOTS.map((slot) => [slot, images[slot]?.[0] ?? null]));
  }

  @Put('careers-page')
  @Permissions('jobs.vacancies.update')
  @ApiOperation({ summary: 'Asignar, reemplazar o quitar imágenes de la sección Trabaja con nosotros' })
  async updateCareersPage(@Body() dto: UpdateCareersPageImagesDto, @CurrentUser() user: RequestUser) {
    for (const slot of CAREERS_PAGE_SLOTS) {
      const ref = dto[slot];
      if (ref === undefined) continue;
      await this.mediaService.setSlot('careers_page', CAREERS_PAGE_ENTITY_ID, slot, ref ? [ref] : [], user);
    }
    return this.careersPage();
  }
}

@ApiTags('Imágenes del CMS (público)')
@Controller('public/media')
export class PublicMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get('careers-page')
  @ApiOperation({ summary: 'Imágenes configuradas para la sección Trabaja con nosotros (público)' })
  async careersPage(): Promise<Record<CareersPageSlot, PublicImage | null>> {
    const images = await this.mediaService.loadForEntity('careers_page', CAREERS_PAGE_ENTITY_ID);
    const pick = (slot: CareersPageSlot) => (images[slot]?.[0] ? toPublicImage(images[slot][0]) : null);
    return { hero: pick('hero'), talent: pick('talent'), growth: pick('growth') };
  }
}
