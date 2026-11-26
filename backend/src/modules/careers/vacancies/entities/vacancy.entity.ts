import { MediaImage } from '../../../media/media.types';

export const VACANCY_MODALITIES = ['ONSITE', 'REMOTE', 'HYBRID'] as const;
export type VacancyModality = (typeof VACANCY_MODALITIES)[number];

export const VACANCY_STATUSES = ['OPEN', 'CLOSED'] as const;
export type VacancyStatus = (typeof VACANCY_STATUSES)[number];

export class VacancyEntity {
  id!: string;
  slug!: string;
  title!: string;
  department!: string | null;
  location!: string | null;
  modality!: VacancyModality;
  description!: string;
  requirements!: string | null;
  status!: VacancyStatus;
  /** Imagen de portada (Etapa 15) — distinta de los documentos que adjuntan los candidatos. */
  imageUrl!: string | null;
  imageAlt!: string | null;
  imageFileId?: string | null;
  gallery?: MediaImage[];
  createdAt!: Date;
  updatedAt!: Date;
}
