import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

/** Imagen asociada a un contenido, tal como la ve el administrador. */
export interface MediaImage {
  fileId: string;
  url: string;
  alt: string | null;
  originalName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
}

/** Forma pública (sitio web): sin nombre original ni metadatos internos. */
export interface PublicImage {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export function toPublicImage(image: MediaImage): PublicImage {
  return { url: image.url, alt: image.alt, width: image.width, height: image.height };
}

/** Respuesta de `POST /media/images`. */
export interface UploadedImage extends MediaImage {
  /** Avisos no bloqueantes (p. ej. resolución menor a la recomendada). */
  warnings: string[];
}

/** Referencia a una imagen ya subida, enviada al guardar un contenido. */
export class MediaRefDto {
  @ApiProperty({ example: '42', description: 'Id del archivo devuelto por POST /media/images' })
  @IsNumberString({ no_symbols: true })
  fileId!: string;

  @ApiPropertyOptional({ example: 'Equipo de Capital Consulting en una capacitación' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  alt?: string;
}
