import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { MAILER } from './mailer.interface';
import { SendmailMailerService } from './sendmail-mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: MAILER, useClass: SendmailMailerService }],
  exports: [MAILER],
})
export class MailerModule {}