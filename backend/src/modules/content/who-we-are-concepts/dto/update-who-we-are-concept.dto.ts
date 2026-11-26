import { PartialType } from '@nestjs/swagger';
import { CreateWhoWeAreConceptDto } from './create-who-we-are-concept.dto';

export class UpdateWhoWeAreConceptDto extends PartialType(CreateWhoWeAreConceptDto) {}
