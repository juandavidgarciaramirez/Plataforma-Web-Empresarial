import { ContentStatus } from '../../common/content.types';
import { MediaImage } from '../../../media/media.types';

export class ServiceEntity {
  id!: string;
  slug!: string;
  name!: string;
  shortDescription!: string;
  description!: string;
  icon!: string | null;
  order!: number;
  status!: ContentStatus;
  /** Imagen principal (Etapa 15). null = la página pública usa su imagen por defecto. */
  imageUrl!: string | null;
  imageAlt!: string | null;
  imageFileId?: string | null;
  gallery?: MediaImage[];
  createdAt!: Date;
  updatedAt!: Date;
}
