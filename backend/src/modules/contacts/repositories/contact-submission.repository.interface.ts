import { ContactSubmissionEntity } from '../entities/contact-submission.entity';

export interface ContactSubmissionRepository {
  findAll(): Promise<ContactSubmissionEntity[]>;
  create(data: Omit<ContactSubmissionEntity, 'id' | 'createdAt'>): Promise<ContactSubmissionEntity>;
  countRecent(days: number): Promise<number>;
}

export const CONTACT_SUBMISSION_REPOSITORY = 'CONTACT_SUBMISSION_REPOSITORY';
