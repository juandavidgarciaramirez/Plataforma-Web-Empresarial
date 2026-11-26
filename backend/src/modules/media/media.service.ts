import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  PayloadTooLargeException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { basename } from 'path';
import { PrismaService } from '../../database/prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';
import { inspectImage } from './image-inspector';
import { IMAGE_STORAGE, ImageStorage } from './image-storage';
import {
  isMediaContext,
  MEDIA_CONTEXTS,
  MEDIA_FOLDER,
  MediaContext,
  mediaLimits,
  slotMax,
  slotRule,
  UNLINKED_UPLOAD_TTL_HOURS,
} from './media.config';
import { MediaImage, MediaRefDto, UploadedImage } from './media.types';

type FileRow = {
  id: bigint;
  original_name: string;
  mime_type: string | null;
  size_bytes: bigint | null;
  folder: string | null;
  file_name: string;
  public_url: string | null;
  width: number | null;
  height: number | null;
  is_deleted: boolean | null;
};

/** Imágenes de un contenido agrupadas por rol (`cover`, `gallery`, `photo`, ...). */
export type EntityImages = Record<string, MediaImage[]>;

/**
 * Imágenes administrables del CMS (Etapa 15). Reutiliza el registro central
 * `foundation.files` (FilesService) y agrega `foundation.file_links` para
 * saber qué contenido usa cada imagen:
 *  - una imagen solo se borra físicamente cuando ya no la usa ningún
 *    contenido (sin huérfanas y sin romper imágenes compartidas);
 *  - las imágenes subidas pero nunca guardadas con un contenido se limpian
 *    pasadas `UNLINKED_UPLOAD_TTL_HOURS` horas.
 */
@Injectable()
export class MediaService {
  private readonly logger = new Logger('MediaService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly auditService: AuditService,
    @Inject(IMAGE_STORAGE) private readonly storage: ImageStorage,
  ) {}

  /** Reglas para el formulario del administrador (mismas que valida el backend). */
  getRules() {
    const limits = mediaLimits();
    return {
      provider: this.storage.provider,
      uploadsEnabled: this.storage.unavailableReason === null,
      unavailableReason: this.storage.unavailableReason,
      maxSizeBytes: limits.maxSizeBytes,
      maxDimension: limits.maxDimension,
      allowedMimeTypes: limits.allowedMimeTypes,
      allowedExtensions: limits.allowedExtensions,
      contexts: Object.fromEntries(
        Object.entries(MEDIA_CONTEXTS).map(([key, rule]) => [
          key,
          {
            label: rule.label,
            permissions: rule.permissions,
            slots: Object.fromEntries(
              Object.entries(rule.slots).map(([slot, slotConfig]) => [slot, { ...slotConfig, max: slotMax(slotConfig) }]),
            ),
          },
        ]),
      ),
    };
  }

  /** Lanza 403 si el usuario no tiene ninguno de los permisos de edición de la sección. */
  assertCanManage(context: MediaContext, user: RequestUser): void {
    const allowed: string[] = MEDIA_CONTEXTS[context].permissions;
    if (!allowed.some((permission) => user.permissions.includes(permission))) {
      throw new ForbiddenException('No tienes permisos para gestionar imágenes en esta sección');
    }
  }

  async uploadImage(
    file: Express.Multer.File | undefined,
    contextValue: string | undefined,
    slotValue: string | undefined,
    user: RequestUser,
  ): Promise<UploadedImage> {
    if (!contextValue || !isMediaContext(contextValue)) {
      throw new BadRequestException('Sección de imágenes no válida');
    }
    const context = contextValue;
    const rule = slotValue ? slotRule(context, slotValue) : null;
    if (!slotValue || !rule) throw new BadRequestException('Tipo de imagen no válido para esta sección');
    this.assertCanManage(context, user);

    if (this.storage.unavailableReason) throw new ServiceUnavailableException(this.storage.unavailableReason);
    if (!file?.buffer?.length) throw new BadRequestException('No se recibió ninguna imagen (campo "archivo")');

    const limits = mediaLimits();
    if (file.size > limits.maxSizeBytes) {
      throw new PayloadTooLargeException(
        `La imagen pesa ${formatMb(file.size)} y el máximo permitido es ${formatMb(limits.maxSizeBytes)}.`,
      );
    }

    // Validación por contenido real: la extensión y el MIME del navegador no cuentan.
    const image = inspectImage(file.buffer);
    if (!image || !limits.allowedFormats.includes(image.format)) {
      throw new BadRequestException(
        `El archivo no es una imagen válida. Formatos aceptados: ${limits.allowedExtensions.join(', ').toUpperCase()}.`,
      );
    }
    if (image.width > limits.maxDimension || image.height > limits.maxDimension) {
      throw new BadRequestException(
        `La imagen mide ${image.width}×${image.height} px; el máximo permitido es ${limits.maxDimension} px por lado.`,
      );
    }

    // Nombre seguro y único: UUID + extensión del formato detectado (nunca el nombre original).
    const key = `${randomUUID()}.${image.extension}`;
    await this.storage.save(key, file.buffer);

    let record;
    try {
      record = await this.filesService.createRecord(
        {
          originalName: safeOriginalName(file.originalname, image.extension),
          fileName: key,
          extension: image.extension,
          mimeType: image.mimeType,
          sizeBytes: file.size,
          folder: MEDIA_FOLDER,
          storagePath: `${MEDIA_FOLDER}/${key}`,
          publicUrl: this.storage.publicUrl(key),
          isPublic: true,
          description: `Imagen ${MEDIA_CONTEXTS[context].label} (${rule.label})`,
          entityType: null,
          entityId: null,
          uploadedBy: user.id,
          width: image.width,
          height: image.height,
        },
        user.email,
      );
    } catch (error) {
      await this.storage.remove(key).catch(() => undefined);
      throw error;
    }

    const warnings: string[] = [];
    if (image.width < rule.recommendedWidth) {
      warnings.push(
        `La imagen mide ${image.width}×${image.height} px. Se recomienda al menos ${rule.recommendedWidth}×${rule.recommendedHeight} px para que se vea nítida.`,
      );
    }

    void this.cleanupUnlinkedUploads();

    return {
      fileId: record.id,
      url: record.publicUrl ?? this.storage.publicUrl(key),
      alt: null,
      originalName: record.originalName,
      mimeType: record.mimeType,
      sizeBytes: file.size,
      width: image.width,
      height: image.height,
      warnings,
    };
  }

  /**
   * Resuelve la imagen principal enviada al guardar un contenido:
   * `undefined` = sin cambios, `null` = quitar la imagen, id = usar ese archivo.
   */
  async resolvePrimary(fileId: string | null | undefined): Promise<MediaImage | null | undefined> {
    if (fileId === undefined) return undefined;
    if (fileId === null) return null;
    const [image] = await this.resolveRefs([{ fileId }]);
    return image;
  }

  /** Valida que cada referencia sea una imagen subida por el CMS y vigente. */
  async resolveRefs(refs: MediaRefDto[]): Promise<MediaImage[]> {
    if (refs.length === 0) return [];
    const ids = refs.map((ref) => toBigInt(ref.fileId));
    if (new Set(ids.map(String)).size !== ids.length) throw new BadRequestException('Hay imágenes repetidas');

    const rows: FileRow[] = await this.prisma.files.findMany({ where: { id: { in: ids }, is_deleted: false, folder: MEDIA_FOLDER } });
    const byId = new Map(rows.map((row) => [row.id.toString(), row]));
    return refs.map((ref) => {
      const row = byId.get(ref.fileId);
      if (!row) throw new BadRequestException(`La imagen ${ref.fileId} no existe o fue eliminada. Vuelve a subirla.`);
      return this.toImage(row, ref.alt?.trim() || null);
    });
  }

  /**
   * Reemplaza las imágenes de un rol (`slot`) de un contenido. Las que dejan
   * de usarse se eliminan solo si ningún otro contenido las referencia.
   */
  async setSlot(
    context: MediaContext,
    entityId: string,
    slot: string,
    refs: MediaRefDto[],
    actor: Pick<RequestUser, 'id' | 'email'>,
  ): Promise<MediaImage[]> {
    const rule = slotRule(context, slot);
    if (!rule) throw new BadRequestException('Tipo de imagen no válido para esta sección');
    const max = slotMax(rule);
    if (refs.length > max) {
      throw new BadRequestException(`${rule.label}: se permiten como máximo ${max} imagen(es).`);
    }

    const images = await this.resolveRefs(refs);
    const entityBigInt = toBigInt(entityId);
    const keepIds = images.map((image) => toBigInt(image.fileId));

    const removedIds = await this.prisma.$transaction(async (tx) => {
      const current = await tx.file_links.findMany({
        where: { entity_type: context, entity_id: entityBigInt, slot },
        select: { file_id: true },
      });
      const removed = current.map((link) => link.file_id).filter((id) => !keepIds.some((keep) => keep === id));
      if (removed.length > 0) {
        await tx.file_links.deleteMany({ where: { entity_type: context, entity_id: entityBigInt, slot, file_id: { in: removed } } });
      }
      for (const [index, image] of images.entries()) {
        const fileId = toBigInt(image.fileId);
        await tx.file_links.upsert({
          where: { entity_type_entity_id_slot_file_id: { entity_type: context, entity_id: entityBigInt, slot, file_id: fileId } },
          create: {
            file_id: fileId,
            entity_type: context,
            entity_id: entityBigInt,
            slot,
            alt_text: image.alt,
            sort_order: index,
            created_by: toBigIntOrNull(actor.id),
          },
          update: { alt_text: image.alt, sort_order: index },
        });
      }
      return removed;
    });

    await this.collectGarbage(removedIds, actor.email);
    return images;
  }

  /** Imágenes de varios contenidos en una sola consulta (evita N+1 en los listados). */
  async loadForEntities(context: MediaContext, entityIds: string[]): Promise<Map<string, EntityImages>> {
    const result = new Map<string, EntityImages>();
    const ids = entityIds.map(toBigIntOrNull).filter((id): id is bigint => id !== null);
    if (ids.length === 0) return result;

    const links = await this.prisma.file_links.findMany({
      where: { entity_type: context, entity_id: { in: ids }, files: { is_deleted: false } },
      include: { files: true },
      orderBy: [{ slot: 'asc' }, { sort_order: 'asc' }, { id: 'asc' }],
    });
    for (const link of links) {
      const key = link.entity_id.toString();
      const images = result.get(key) ?? {};
      (images[link.slot] ??= []).push(this.toImage(link.files, link.alt_text));
      result.set(key, images);
    }
    return result;
  }

  async loadForEntity(context: MediaContext, entityId: string): Promise<EntityImages> {
    return (await this.loadForEntities(context, [entityId])).get(entityId) ?? {};
  }

  /** Al eliminar definitivamente un contenido: suelta sus imágenes (y borra las que quedan sin uso). */
  async releaseEntity(context: MediaContext, entityId: string, actorEmail: string): Promise<void> {
    const entityBigInt = toBigIntOrNull(entityId);
    if (entityBigInt === null) return;
    const links = await this.prisma.file_links.findMany({
      where: { entity_type: context, entity_id: entityBigInt },
      select: { file_id: true },
    });
    if (links.length === 0) return;
    await this.prisma.file_links.deleteMany({ where: { entity_type: context, entity_id: entityBigInt } });
    await this.collectGarbage(
      links.map((link) => link.file_id),
      actorEmail,
    );
  }

  /** Borra (registro lógico + archivo físico) las imágenes del CMS que ya no usa ningún contenido. */
  private async collectGarbage(fileIds: bigint[], actorEmail: string): Promise<void> {
    for (const fileId of new Set(fileIds)) {
      const stillUsed = await this.prisma.file_links.count({ where: { file_id: fileId } });
      if (stillUsed > 0) continue;
      const file = await this.prisma.files.findFirst({ where: { id: fileId, folder: MEDIA_FOLDER, is_deleted: false } });
      if (!file) continue;
      try {
        await this.filesService.remove(file.id.toString(), actorEmail);
        await this.storage.remove(file.file_name);
      } catch (error) {
        this.logger.error(`No se pudo eliminar la imagen sin uso ${file.id}: ${(error as Error).message}`);
      }
    }
  }

  /** Imágenes subidas que nunca se guardaron con un contenido (formulario cancelado, etc.). */
  async cleanupUnlinkedUploads(): Promise<void> {
    try {
      const threshold = new Date(Date.now() - UNLINKED_UPLOAD_TTL_HOURS * 3600 * 1000);
      const stale = await this.prisma.files.findMany({
        where: { folder: MEDIA_FOLDER, is_deleted: false, created_at: { lt: threshold }, file_links: { none: {} } },
        select: { id: true },
        take: 50,
      });
      await this.collectGarbage(
        stale.map((file) => file.id),
        'sistema@limpieza-imagenes',
      );
    } catch (error) {
      this.logger.error(`Limpieza de imágenes sin uso falló: ${(error as Error).message}`);
    }
  }

  private toImage(row: FileRow, alt: string | null): MediaImage {
    return {
      fileId: row.id.toString(),
      url: row.public_url ?? this.storage.publicUrl(row.file_name),
      alt,
      originalName: row.original_name,
      mimeType: row.mime_type,
      sizeBytes: row.size_bytes === null ? null : Number(row.size_bytes),
      width: row.width,
      height: row.height,
    };
  }
}

function toBigInt(id: string): bigint {
  const value = toBigIntOrNull(id);
  if (value === null) throw new BadRequestException(`Identificador no válido: ${id}`);
  return value;
}

function toBigIntOrNull(id: string | null | undefined): bigint | null {
  if (!id || !/^\d+$/.test(id)) return null;
  return BigInt(id);
}

function formatMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`;
}

/** Conserva el nombre original solo como referencia legible (sin rutas ni caracteres de control). */
function safeOriginalName(originalName: string | undefined, extension: string): string {
  const base = basename(decodeMultipartName(originalName || ''))
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, '')
    .trim()
    .slice(0, 200);
  return base || `imagen.${extension}`;
}

/** Multer entrega el nombre del archivo decodificado como latin1: se recupera el UTF-8 original (tildes, ñ). */
function decodeMultipartName(name: string): string {
  const decoded = Buffer.from(name, 'latin1').toString('utf8');
  return decoded.includes('�') ? name : decoded;
}
