import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('CRM - Contactos')
@ApiBearerAuth()
@Controller('crm/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @Permissions('crm.contacts.read')
  @ApiOperation({ summary: 'Listar contactos' })
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @Permissions('crm.contacts.read')
  @ApiOperation({ summary: 'Obtener un contacto por id' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Post()
  @Permissions('crm.contacts.create')
  @ApiOperation({ summary: 'Crear un contacto' })
  create(@Body() dto: CreateContactDto, @CurrentUser() user: RequestUser) {
    return this.contactsService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('crm.contacts.update')
  @ApiOperation({ summary: 'Actualizar un contacto' })
  update(@Param('id') id: string, @Body() dto: UpdateContactDto, @CurrentUser() user: RequestUser) {
    return this.contactsService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('crm.contacts.delete')
  @ApiOperation({ summary: 'Eliminar un contacto' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.contactsService.remove(id, user.email);
  }
}
