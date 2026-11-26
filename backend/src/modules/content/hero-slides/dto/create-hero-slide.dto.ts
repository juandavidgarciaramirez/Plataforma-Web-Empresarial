import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export class HeroSlideItemDto {
  @ApiProperty({ example: 'Formación' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({ example: 'GraduationCap', description: 'Nombre del icono de lucide-react.' })
  @IsString()
  @IsNotEmpty()
  icon!: string;
}

export class CreateHeroSlideDto {
  @ApiProperty({ example: 'capital-learning' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'slug debe ser en minúsculas (letras, números, guiones)' })
  slug!: string;

  @ApiPropertyOptional({ example: 'capital-learning', description: 'Código de catalog.services, si el slide corresponde a una línea de servicio.' })
  @IsOptional()
  @IsString()
  serviceCode?: string;

  @ApiProperty({ example: 'CAPITAL' })
  @IsString()
  @IsNotEmpty()
  nameWhite!: string;

  @ApiProperty({ example: 'LEARNING' })
  @IsString()
  @IsNotEmpty()
  nameBlue!: string;

  @ApiProperty({ example: 'Desarrollamos el talento que transforma organizaciones.' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'center 20%' })
  @IsOptional()
  @IsString()
  imagePosition?: string;

  @ApiProperty({ example: '/servicios/capital-learning' })
  @IsString()
  @IsNotEmpty()
  href!: string;

  @ApiPropertyOptional({ type: [HeroSlideItemDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HeroSlideItemDto)
  @ArrayMaxSize(10)
  items?: HeroSlideItemDto[];

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
