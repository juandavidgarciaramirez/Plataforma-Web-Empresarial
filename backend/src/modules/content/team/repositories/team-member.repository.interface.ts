import { TeamMemberEntity } from '../entities/team-member.entity';

export interface TeamMemberRepository {
  findAll(): Promise<TeamMemberEntity[]>;
  findById(id: string): Promise<TeamMemberEntity | null>;
  create(data: Omit<TeamMemberEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMemberEntity>;
  update(
    id: string,
    data: Partial<Omit<TeamMemberEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TeamMemberEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const TEAM_MEMBER_REPOSITORY = 'TEAM_MEMBER_REPOSITORY';
