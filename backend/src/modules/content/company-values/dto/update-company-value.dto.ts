import { PartialType } from '@nestjs/swagger';
import { CreateCompanyValueDto } from './create-company-value.dto';

export class UpdateCompanyValueDto extends PartialType(CreateCompanyValueDto) {}
