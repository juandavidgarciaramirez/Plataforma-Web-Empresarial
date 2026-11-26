import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatReplyDto } from './dto/chat-reply.dto';
import { Public } from '../../common/decorators/public.decorator';

/**
 * API del chat — Yuri, el asistente virtual de Capital Consulting (Fase 16
 * del brief). Endpoint público: lo usan visitantes anónimos del sitio antes
 * de cualquier login.
 */
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar un mensaje a Yuri y recibir su respuesta (con contexto de sesión)' })
  sendMessage(@Body() dto: SendMessageDto): Promise<ChatReplyDto> {
    return this.chatService.handleMessage(dto);
  }
}
