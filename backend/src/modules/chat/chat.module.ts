import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { CHAT_REPOSITORY } from './repositories/chat.repository.interface';
import { PrismaChatRepository } from './repositories/prisma-chat.repository';
import { LeadsModule } from '../crm/leads/leads.module';

@Module({
  imports: [LeadsModule],
  controllers: [ChatController],
  providers: [ChatService, { provide: CHAT_REPOSITORY, useClass: PrismaChatRepository }],
  exports: [ChatService],
})
export class ChatModule {}
