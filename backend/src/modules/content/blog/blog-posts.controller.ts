import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Contenido - Blog')
@ApiBearerAuth()
@Controller('blog')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Get()
  @Permissions('cms.blog.read')
  @ApiOperation({ summary: 'Listar publicaciones del blog' })
  findAll() {
    return this.blogPostsService.findAll();
  }

  @Get(':id')
  @Permissions('cms.blog.read')
  @ApiOperation({ summary: 'Obtener una publicación por id' })
  findOne(@Param('id') id: string) {
    return this.blogPostsService.findOne(id);
  }

  @Post()
  @Permissions('cms.blog.create')
  @ApiOperation({ summary: 'Crear una publicación' })
  create(@Body() dto: CreateBlogPostDto, @CurrentUser() user: RequestUser) {
    return this.blogPostsService.create(dto, user);
  }

  @Patch(':id')
  @Permissions('cms.blog.update')
  @ApiOperation({ summary: 'Actualizar una publicación' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto, @CurrentUser() user: RequestUser) {
    return this.blogPostsService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('cms.blog.delete')
  @ApiOperation({ summary: 'Eliminar una publicación' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.blogPostsService.remove(id, user);
  }
}
