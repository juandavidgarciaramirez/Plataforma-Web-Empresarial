import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, Min } from 'class-validator';

export class CreateCompanyValueDto {
  @ApiProperty({ example: 'integridad', description: 'Identificador estable (slug), usado por el frontend para mapear el icono.' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'key debe ser slug en minúsculas (letras, números, guiones)' })
  key!: string;

  @ApiProperty({ example: 'Integridad' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'ShieldCheck', description: 'Nombre del icono de lucide-react.' })
  @IsOptional()
  @IsString()
  iconKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

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
