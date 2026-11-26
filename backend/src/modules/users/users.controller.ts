import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('security.users.read')
  @ApiOperation({ summary: 'Listar usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('security.users.read')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions('security.users.create')
  @ApiOperation({ summary: 'Crear un usuario' })
  create(@Body() dto: CreateUserDto, @CurrentUser() user: RequestUser) {
    return this.usersService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('security.users.update')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: RequestUser) {
    return this.usersService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('security.users.delete')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.usersService.remove(id, user.email);
  }
}
