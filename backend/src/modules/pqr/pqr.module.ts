import { Module } from '@nestjs/common';
import { PqrService } from './pqr.service';
import { PqrController } from './pqr.controller';
import { PQR_REPOSITORY } from './repositories/pqr.repository.interface';
import { PrismaPqrRepository } from './repositories/prisma-pqr.repository';
import { MailerModule } from '../../common/mailer/mailer.module';

@Module({
  imports: [MailerModule],
  controllers: [PqrController],
  providers: [PqrService, { provide: PQR_REPOSITORY, useClass: PrismaPqrRepository }],
  exports: [PqrService],
})
export class PqrModule {}
