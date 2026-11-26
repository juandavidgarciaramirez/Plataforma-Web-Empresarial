import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ApplicationsService } from './applications.service';
import { CreateApplicationPublicDto } from './dto/create-application-public.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';
import { extractClientIp } from '../../../common/utils/request-ip.util';
import { RESUME_RULE, diskStorageFor, fileFilterFor, relativeUploadPath } from '../../../common/utils/file-upload.util';
import { FilesService } from '../../files/files.service';

/**
 * "Trabaja con nosotros" (sección 23 del encargo). Etapa 3 (2026-08-26):
 * antes el `POST` público vivía en un segundo backend (Next.js,
 * `src/features/careers`) — se retiró esa duplicación (regla 7).
 */
@ApiTags('Talento - Postulaciones')
@Controller('careers/applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly filesService: FilesService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Postularse a la Base de Altos Potenciales (público, sección 23 del encargo)' })
  @UseInterceptors(
    FileInterceptor('hojaDeVida', {
      storage: diskStorageFor('careers/cv'),
      fileFilter: fileFilterFor(RESUME_RULE),
      limits: { fileSize: RESUME_RULE.maxSizeBytes },
    }),
  )
  async createPublic(
    @Body() dto: CreateApplicationPublicDto,
    @Req() request: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('La hoja de vida es obligatoria');
    }

    // Etapa 14: ApplicationsModule ya usa PrismaApplicationRepository (careers.applications es real).
    // El archivo se registra primero en foundation.files para poder enlazarlo por FK real
    // (applications.cv_file_id) en el mismo INSERT de la postulación.
    const registeredFile = await this.filesService.register(file, 'careers/cv', dto.correo, {
      entityType: 'application',
      description: `Hoja de vida — ${dto.nombreCompleto}`,
    });

    const created = await this.applicationsService.createPublic(dto, {
      ip: extractClientIp(request),
      cvFile: {
        url: relativeUploadPath('careers/cv', file.filename),
        fileName: file.originalname,
        sizeBytes: file.size,
        mimeType: file.mimetype,
        fileId: registeredFile.id,
      },
    });

    return { id: created.id, status: created.status };
  }

  @Get()
  @ApiBearerAuth()
  @Permissions('jobs.vacancies.read')
  @ApiOperation({ summary: 'Listar postulaciones recibidas (Admin)' })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Permissions('jobs.vacancies.read')
  @ApiOperation({ summary: 'Obtener una postulación por id (Admin)' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Permissions('jobs.vacancies.update')
  @ApiOperation({ summary: 'Actualizar el estado de una postulación (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto, @CurrentUser() user: RequestUser) {
    return this.applicationsService.update(id, dto, user.email);
  }
}
