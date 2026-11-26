import { Module } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { PublicTeamController } from './public-team.controller';
import { TEAM_MEMBER_REPOSITORY } from './repositories/team-member.repository.interface';
import { PrismaTeamMemberRepository } from './repositories/prisma-team-member.repository';

@Module({
  controllers: [TeamMembersController, PublicTeamController],
  providers: [TeamMembersService, { provide: TEAM_MEMBER_REPOSITORY, useClass: PrismaTeamMemberRepository }],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
