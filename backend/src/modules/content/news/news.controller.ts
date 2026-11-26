import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Contenido - Noticias')
@ApiBearerAuth()
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @Permissions('cms.news.read')
  @ApiOperation({ summary: 'Listar noticias' })
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  @Permissions('cms.news.read')
  @ApiOperation({ summary: 'Obtener una noticia por id' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Post()
  @Permissions('cms.news.create')
  @ApiOperation({ summary: 'Crear una noticia' })
  create(@Body() dto: CreateNewsDto, @CurrentUser() user: RequestUser) {
    return this.newsService.create(dto, user);
  }

  @Patch(':id')
  @Permissions('cms.news.update')
  @ApiOperation({ summary: 'Actualizar una noticia' })
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto, @CurrentUser() user: RequestUser) {
    return this.newsService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('cms.news.delete')
  @ApiOperation({ summary: 'Eliminar una noticia' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.newsService.remove(id, user);
  }
}
