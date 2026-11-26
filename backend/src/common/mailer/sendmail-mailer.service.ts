import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'node:child_process';

import { MailMessage, Mailer } from './mailer.interface';

@Injectable()
export class SendmailMailerService implements Mailer {
  private readonly logger = new Logger('Mailer');
  private readonly sendmailPath: string;

  constructor(private readonly configService: ConfigService) {
    this.sendmailPath =
      this.configService.get<string>('mailer.sendmailPath') ||
      (process.env.NODE_ENV === 'production' ? '/sbin/sendmail' : '');
  }

  async send(message: MailMessage): Promise<void> {
    if (!this.sendmailPath) {
      this.logger.warn(
        `Sendmail no está configurado en este entorno. ` +
          `Correo simulado para ${message.to}: ${message.subject}`,
      );
      return;
    }

    this.validateHeader(message.to, 'destinatario');
    this.validateHeader(message.subject, 'asunto');

    await new Promise<void>((resolve, reject) => {
      const process = spawn(this.sendmailPath, ['-t', '-i'], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stderr = '';

      process.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      process.on('error', (error) => {
        reject(error);
      });

      process.on('close', (code) => {
        if (code === 0) {
          this.logger.log(`Correo enviado a ${message.to}`);
          resolve();
          return;
        }

        reject(
          new Error(
            `Sendmail terminó con código ${code}: ${
              stderr.trim() || 'sin detalles'
            }`,
          ),
        );
      });

      const signatureUrl =
        'https://www.capitalconsulting.com.co/images/email-signature.png';

      const htmlBody = message.html
        ? `${message.html}
          <br><br>
          <img
            src="${signatureUrl}"
            alt="Capital Consulting and Services SAS"
            style="display:block;width:549px;max-width:100%;height:auto;border:0;"
          />`
        : `
          <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
            ${message.text.replace(/\n/g, '<br>')}
          </div>
          <br><br>
          <img
            src="${signatureUrl}"
            alt="Capital Consulting and Services SAS"
            style="display:block;width:549px;max-width:100%;height:auto;border:0;"
          />
        `;

      const attachments = message.attachments ?? [];

      if (attachments.length === 0) {
        const headers = [
          `To: ${message.to}`,
          `From: ${message.from ?? 'ejecutivacomercial@capitalconsulting.com.co'}`,
          ...(message.replyTo ? [`Reply-To: ${message.replyTo}`] : []),
          `Subject: ${message.subject}`,
          'MIME-Version: 1.0',
          'Content-Type: text/html; charset=UTF-8',
          '',
          htmlBody,
          '',
        ].join('\n');

        process.stdin.write(headers);
        process.stdin.end();
        return;
      }

      const boundary = `----=_CapitalConsulting_${Date.now()}_${Math.random()
        .toString(16)
        .slice(2)}`;

      const parts: string[] = [
        `To: ${message.to}`,
        `From: ${message.from ?? 'ejecutivacomercial@capitalconsulting.com.co'}`,
        ...(message.replyTo ? [`Reply-To: ${message.replyTo}`] : []),
        `Subject: ${message.subject}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        htmlBody,
        '',
      ];

      for (const attachment of attachments) {
        this.validateHeader(attachment.filename, 'nombre del archivo');

        const encoded = attachment.content.toString('base64');

        parts.push(
          `--${boundary}`,
          `Content-Type: ${attachment.contentType}; name="${attachment.filename}"`,
          `Content-Disposition: attachment; filename="${attachment.filename}"`,
          'Content-Transfer-Encoding: base64',
          '',
          encoded.match(/.{1,76}/g)?.join('\r\n') ?? '',
          '',
        );
      }

      parts.push(`--${boundary}--`, '');

      process.stdin.write(parts.join('\r\n'));
      process.stdin.end();
    });
  }

  private validateHeader(value: string, field: string): void {
    if (/[\r\n]/.test(value)) {
      throw new Error(`Valor inválido en el campo ${field}.`);
    }
  }
}
