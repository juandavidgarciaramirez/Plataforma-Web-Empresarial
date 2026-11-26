import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { ChatContextDto } from './chat-context.dto';

export class SendMessageDto {
  @ApiProperty({ example: 'b3c1b6d4-df1a-4a6a-9e77-9c6a2f9b5a10', description: 'Identificador de sesión del chat (generado en el navegador y persistido mientras dure la conversación).' })
  @IsString()
  @IsNotEmpty({ message: 'sessionId es requerido' })
  @MaxLength(120)
  sessionId!: string;

  @ApiProperty({ example: 'Necesito ayuda con SST' })
  @IsString()
  @IsNotEmpty({ message: 'message es requerido' })
  @MaxLength(2000)
  message!: string;

  @ApiPropertyOptional({ type: ChatContextDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ChatContextDto)
  context?: ChatContextDto;
}
