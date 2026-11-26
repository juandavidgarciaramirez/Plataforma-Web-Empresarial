import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { OPPORTUNITY_STAGES, OpportunityStage } from '../entities/opportunity.entity';

export class ChangeStageDto {
  @ApiProperty({ enum: OPPORTUNITY_STAGES })
  @IsIn(OPPORTUNITY_STAGES)
  stage!: OpportunityStage;
}
