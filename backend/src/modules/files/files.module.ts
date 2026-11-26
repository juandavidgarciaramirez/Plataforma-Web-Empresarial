import { Global, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FILE_REPOSITORY } from './repositories/file.repository.interface';
import { PrismaFileRepository } from './repositories/prisma-file.repository';

/** Global: cualquier módulo puede inyectar FilesService para registrar un archivo en el registro central, sin importarlo explícitamente. */
@Global()
@Module({
  controllers: [FilesController],
  providers: [FilesService, { provide: FILE_REPOSITORY, useClass: PrismaFileRepository }],
  exports: [FilesService],
})
export class FilesModule {}
