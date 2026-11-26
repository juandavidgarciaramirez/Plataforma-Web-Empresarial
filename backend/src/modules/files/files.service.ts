import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { extname, join } from 'path';
import { CreateFileData, FILE_REPOSITORY, FileRepository } from './repositories/file.repository.interface';
import { FileEntity } from './entities/file.entity';
import { AuditService } from '../audit/audit.service';
import { relativeUploadPath } from '../../common/utils/file-upload.util';

function storageRoot(): string {
  return process.env.FILE_STORAGE_PATH || './uploads';
}

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILE_REPOSITORY) private readonly fileRepository: FileRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(filters?: { entityType?: string; entityId?: string }): Promise<FileEntity[]> {
    return this.fileRepository.findAll(filters);
  }

  async findOne(id: string): Promise<FileEntity> {
    const file = await this.fileRepository.findById(id);
    if (!file) throw new NotFoundException('Archivo no encontrado');
    return file;
  }

  async register(
    file: Express.Multer.File,
    subfolder: string,
    actorEmail: string,
    options?: { description?: string; entityType?: string; entityId?: string; isPublic?: boolean },
  ): Promise<FileEntity> {
    const created = await this.fileRepository.create({
      originalName: file.originalname,
      fileName: file.filename,
      extension: extname(file.originalname).toLowerCase().replace('.', '') || null,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      folder: subfolder,
      storagePath: relativeUploadPath(subfolder, file.filename),
      description: options?.description,
      isPublic: options?.isPublic,
      entityType: options?.entityType,
      entityId: options?.entityId,
      uploadedBy: null, // se resuelve por email si hace falta trazabilidad exacta; ver AuditService para el registro del actor
    });
    this.auditService.log(actorEmail, 'files.create', `Archivo subido: ${created.originalName}`);
    return created;
  }

  /**
   * Registra un archivo ya almacenado por el llamador (p. ej. una imagen del
   * CMS validada y guardada por MediaService) con metadatos explícitos.
   */
  async createRecord(data: CreateFileData, actorEmail: string): Promise<FileEntity> {
    const created = await this.fileRepository.create(data);
    this.auditService.log(actorEmail, 'files.create', `Archivo subido: ${created.originalName}`);
    return created;
  }

  async remove(id: string, actorEmail: string, deletePhysicalFile = false): Promise<void> {
    const file = await this.findOne(id);
    await this.fileRepository.softDelete(id);
    if (deletePhysicalFile) {
      const absolutePath = join(storageRoot(), file.storagePath);
      if (existsSync(absolutePath)) unlinkSync(absolutePath);
    }
    this.auditService.log(actorEmail, 'files.delete', `Archivo eliminado: ${file.originalName}`);
  }

  /** Ruta absoluta en disco para servir la descarga. */
  absolutePathOf(file: FileEntity): string {
    return join(storageRoot(), file.storagePath);
  }
}
