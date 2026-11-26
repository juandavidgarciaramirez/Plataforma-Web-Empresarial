import { Global, Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController, PublicMediaController } from './media.controller';
import { createImageStorage, IMAGE_STORAGE } from './image-storage';

/** Global: los módulos de contenido (Noticias, Blog, Servicios, Equipo, Vacantes) inyectan MediaService sin importarlo. */
@Global()
@Module({
  controllers: [MediaController, PublicMediaController],
  providers: [MediaService, { provide: IMAGE_STORAGE, useFactory: createImageStorage }],
  exports: [MediaService],
})
export class MediaModule {}
