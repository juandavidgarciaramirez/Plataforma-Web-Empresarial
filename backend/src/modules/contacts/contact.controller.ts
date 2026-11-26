import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactPublicDto } from './dto/create-contact-public.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { extractClientIp } from '../../common/utils/request-ip.util';

/**
 * Formulario público "Contáctenos" (sección 22 del encargo). Etapa 3
 * (2026-08-26): antes vivía en el segundo backend (Next.js,
 * `src/features/contact`) — se retiró esa duplicación (regla 7).
 */
@ApiTags('Contacto')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  @ApiOperation({ summary: 'Enviar el formulario público de contacto (sección 22 del encargo)' })
  createPublic(@Body() dto: CreateContactPublicDto, @Req() request: Request) {
    return this.contactService.createPublic(dto, extractClientIp(request));
  }

  @Get()
  @ApiBearerAuth()
  @Permissions('crm.leads.read')
  @ApiOperation({ summary: 'Listar los envíos del formulario de contacto (Admin)' })
  findAll() {
    return this.contactService.findAll();
  }
}
