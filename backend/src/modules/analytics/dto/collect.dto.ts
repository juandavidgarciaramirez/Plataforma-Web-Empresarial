import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ANALYTICS_EVENT_NAMES, AnalyticsEventName, MAX_EVENTS_PER_BATCH } from '../analytics.constants';

/** Parámetros UTM vigentes de la visita (los lee el navegador de la URL de llegada). */
export class CollectAttributionDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(/^[a-z0-9.-]+$/i, { message: 'referrerHost debe ser un nombre de host' })
  referrerHost?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmSource?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmMedium?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  utmCampaign?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  utmTerm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  utmContent?: string;

  @IsOptional()
  @IsBoolean()
  paidClick?: boolean;
}

export class CollectEventDto {
  /** pageview = página vista · event = acción del visitante · ping = actividad (solo actualiza la duración de la sesión). */
  @IsIn(['pageview', 'event', 'ping'])
  type!: 'pageview' | 'event' | 'ping';

  @IsOptional()
  @IsIn(ANALYTICS_EVENT_NAMES)
  name?: AnalyticsEventName;

  @IsString()
  @MaxLength(300)
  @Matches(/^\/[^\s]*$/, { message: 'path debe ser una ruta del sitio' })
  path!: string;

  /** Seudónimos aleatorios: solo llegan si el visitante aceptó cookies analíticas. */
  @IsOptional()
  @IsUUID('4')
  visitorId?: string;

  @IsOptional()
  @IsUUID('4')
  sessionId?: string;

  /** Primera página vista de una llegada al sitio (visita). */
  @IsOptional()
  @IsBoolean()
  entrance?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollectAttributionDto)
  attribution?: CollectAttributionDto;

  /** Se valida contra la lista blanca del evento en el servicio (claves y valores). */
  @IsOptional()
  @IsObject()
  props?: Record<string, unknown>;

  /** Milisegundos desde que ocurrió el evento hasta el envío (cola del navegador); se acota en el servicio. */
  @IsOptional()
  @IsInt()
  ageMs?: number;
}

export class CollectBatchDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_EVENTS_PER_BATCH)
  @ValidateNested({ each: true })
  @Type(() => CollectEventDto)
  events!: CollectEventDto[];
}
