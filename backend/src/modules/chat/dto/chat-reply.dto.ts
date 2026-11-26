import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatIntent } from '../chat.constants';
import { ChatContextDto } from './chat-context.dto';

class ChatChannelLink {
  @ApiProperty() label!: string;
  @ApiProperty() url!: string;
}

/** Canales de escalamiento a asesor humano (sección 23-25 del brief). */
class ChatEscalationChannels {
  @ApiProperty({ type: ChatChannelLink }) whatsapp!: ChatChannelLink;
  @ApiProperty({ type: ChatChannelLink }) email!: ChatChannelLink;
}

class ChatLink {
  @ApiProperty() label!: string;
  @ApiProperty() href!: string;
}

export class ChatReplyDto {
  @ApiProperty({ example: 'Claro. Podemos orientarte con Capital HSE. ¿Tu empresa ya tiene un SG-SST implementado?' })
  message!: string;

  @ApiProperty({ example: 'Yuri' })
  assistant!: string;

  @ApiProperty({ enum: ['greeting', 'service_inquiry', 'quote', 'pqr', 'careers', 'contact', 'human_agent', 'unknown'] })
  intent!: ChatIntent;

  @ApiPropertyOptional({ example: 'capital-hse', nullable: true })
  service!: string | null;

  @ApiProperty({ type: [String], example: ['Sí', 'No', 'No estoy seguro'] })
  suggestions!: string[];

  @ApiProperty({ example: false })
  escalateToHuman!: boolean;

  @ApiProperty({ example: false, description: 'true cuando el mensaje representa una intención comercial (cotización) — preparado para integración futura con el CRM (sección 22 del brief). Todavía NO crea un Lead.' })
  leadIntent!: boolean;

  @ApiPropertyOptional({ type: ChatEscalationChannels, nullable: true })
  channels!: ChatEscalationChannels | null;

  @ApiPropertyOptional({ type: ChatLink, nullable: true })
  link!: ChatLink | null;

  @ApiProperty({ type: ChatContextDto })
  context!: ChatContextDto;
}
