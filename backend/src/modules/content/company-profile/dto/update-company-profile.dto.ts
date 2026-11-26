import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

/** Todos los campos son opcionales: PATCH parcial sobre la fila única. */
export class UpdateCompanyProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeAboutEyebrow?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeAboutTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeAboutText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  homeAboutImageUrl?: string;

  @ApiPropertyOptional({ description: 'Cifra tipo "50+". CONFIGURACIÓN PENDIENTE hasta tener el dato real.' })
  @IsOptional()
  @IsString()
  homeAboutStat1Value?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeAboutStat1Label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeAboutStat2Value?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeAboutStat2Label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutHeroTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutHeroSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  aboutHeroImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutWhoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutWhoText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  aboutWhoImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutMissionText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  aboutMissionImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutVisionYear?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutVisionText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  aboutVisionImageUrl?: string;

  @ApiPropertyOptional({ description: 'Poner en false cuando el cliente confirme el texto oficial de Misión/Visión.' })
  @IsOptional()
  @IsBoolean()
  missionVisionIsPlaceholder?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutEcosystemTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutEcosystemText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutTeamTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutTeamSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutCtaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutCtaMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  aboutCtaImageUrl?: string;
}
