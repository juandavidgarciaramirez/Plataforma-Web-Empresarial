export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export interface Mailer {
  send(message: MailMessage): Promise<void>;
}

export const MAILER = 'MAILER';
