import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { CompanyProfileEntity } from '../entities/company-profile.entity';
import { CompanyProfileRepository } from './company-profile.repository.interface';

type CompanyProfileRow = Awaited<ReturnType<PrismaService['company_profile']['findUniqueOrThrow']>>;

/** Implementación real sobre `content.company_profile` (Etapa 7, tabla nueva, fila única id=1). */
@Injectable()
export class PrismaCompanyProfileRepository implements CompanyProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<CompanyProfileEntity> {
    const row = await this.prisma.company_profile.findUniqueOrThrow({ where: { id: 1 } });
    return this.toEntity(row);
  }

  async update(data: Partial<Omit<CompanyProfileEntity, 'updatedAt'>>): Promise<CompanyProfileEntity> {
    const row = await this.prisma.company_profile.update({
      where: { id: 1 },
      data: {
        ...(data.homeAboutEyebrow !== undefined && { home_about_eyebrow: data.homeAboutEyebrow }),
        ...(data.homeAboutTitle !== undefined && { home_about_title: data.homeAboutTitle }),
        ...(data.homeAboutText !== undefined && { home_about_text: data.homeAboutText }),
        ...(data.homeAboutImageUrl !== undefined && { home_about_image_url: data.homeAboutImageUrl }),
        ...(data.homeAboutStat1Value !== undefined && { home_about_stat1_value: data.homeAboutStat1Value }),
        ...(data.homeAboutStat1Label !== undefined && { home_about_stat1_label: data.homeAboutStat1Label }),
        ...(data.homeAboutStat2Value !== undefined && { home_about_stat2_value: data.homeAboutStat2Value }),
        ...(data.homeAboutStat2Label !== undefined && { home_about_stat2_label: data.homeAboutStat2Label }),
        ...(data.aboutHeroTitle !== undefined && { about_hero_title: data.aboutHeroTitle }),
        ...(data.aboutHeroSubtitle !== undefined && { about_hero_subtitle: data.aboutHeroSubtitle }),
        ...(data.aboutHeroImageUrl !== undefined && { about_hero_image_url: data.aboutHeroImageUrl }),
        ...(data.aboutWhoTitle !== undefined && { about_who_title: data.aboutWhoTitle }),
        ...(data.aboutWhoText !== undefined && { about_who_text: data.aboutWhoText }),
        ...(data.aboutWhoImageUrl !== undefined && { about_who_image_url: data.aboutWhoImageUrl }),
        ...(data.aboutMissionText !== undefined && { about_mission_text: data.aboutMissionText }),
        ...(data.aboutMissionImageUrl !== undefined && { about_mission_image_url: data.aboutMissionImageUrl }),
        ...(data.aboutVisionYear !== undefined && { about_vision_year: data.aboutVisionYear }),
        ...(data.aboutVisionText !== undefined && { about_vision_text: data.aboutVisionText }),
        ...(data.aboutVisionImageUrl !== undefined && { about_vision_image_url: data.aboutVisionImageUrl }),
        ...(data.missionVisionIsPlaceholder !== undefined && {
          mission_vision_is_placeholder: data.missionVisionIsPlaceholder,
        }),
        ...(data.aboutEcosystemTitle !== undefined && { about_ecosystem_title: data.aboutEcosystemTitle }),
        ...(data.aboutEcosystemText !== undefined && { about_ecosystem_text: data.aboutEcosystemText }),
        ...(data.aboutTeamTitle !== undefined && { about_team_title: data.aboutTeamTitle }),
        ...(data.aboutTeamSubtitle !== undefined && { about_team_subtitle: data.aboutTeamSubtitle }),
        ...(data.aboutCtaTitle !== undefined && { about_cta_title: data.aboutCtaTitle }),
        ...(data.aboutCtaMessage !== undefined && { about_cta_message: data.aboutCtaMessage }),
        ...(data.aboutCtaImageUrl !== undefined && { about_cta_image_url: data.aboutCtaImageUrl }),
        updated_at: new Date(),
      },
    });
    return this.toEntity(row);
  }

  private toEntity(row: CompanyProfileRow): CompanyProfileEntity {
    const entity = new CompanyProfileEntity();
    entity.homeAboutEyebrow = row.home_about_eyebrow;
    entity.homeAboutTitle = row.home_about_title;
    entity.homeAboutText = row.home_about_text;
    entity.homeAboutImageUrl = row.home_about_image_url;
    entity.homeAboutStat1Value = row.home_about_stat1_value;
    entity.homeAboutStat1Label = row.home_about_stat1_label;
    entity.homeAboutStat2Value = row.home_about_stat2_value;
    entity.homeAboutStat2Label = row.home_about_stat2_label;
    entity.aboutHeroTitle = row.about_hero_title;
    entity.aboutHeroSubtitle = row.about_hero_subtitle;
    entity.aboutHeroImageUrl = row.about_hero_image_url;
    entity.aboutWhoTitle = row.about_who_title;
    entity.aboutWhoText = row.about_who_text;
    entity.aboutWhoImageUrl = row.about_who_image_url;
    entity.aboutMissionText = row.about_mission_text;
    entity.aboutMissionImageUrl = row.about_mission_image_url;
    entity.aboutVisionYear = row.about_vision_year;
    entity.aboutVisionText = row.about_vision_text;
    entity.aboutVisionImageUrl = row.about_vision_image_url;
    entity.missionVisionIsPlaceholder = row.mission_vision_is_placeholder;
    entity.aboutEcosystemTitle = row.about_ecosystem_title;
    entity.aboutEcosystemText = row.about_ecosystem_text;
    entity.aboutTeamTitle = row.about_team_title;
    entity.aboutTeamSubtitle = row.about_team_subtitle;
    entity.aboutCtaTitle = row.about_cta_title;
    entity.aboutCtaMessage = row.about_cta_message;
    entity.aboutCtaImageUrl = row.about_cta_image_url;
    entity.updatedAt = row.updated_at;
    return entity;
  }
}
