import { Injectable, Logger } from '@nestjs/common';
import { MailMessage, Mailer } from './mailer.interface';

/**
 * Implementación TEMPORAL de `Mailer`: no envía correo real, solo lo
 * deja en el log del servidor. Sirve para probar el flujo completo de
 * recuperación de contraseña (sección 5/45 del brief) sin depender de un
 * proveedor de email todavía configurado — mismo criterio que ya usa
 * `SeedService` al loguear las credenciales del admin de prueba.
 */
@Injectable()
export class ConsoleMailerService implements Mailer {
  private readonly logger = new Logger('Mailer');

  async send(message: MailMessage): Promise<void> {
    this.logger.log(
      `[DEV] Correo a ${message.to} — "${message.subject}"\n${message.text}`,
    );
  }
}
