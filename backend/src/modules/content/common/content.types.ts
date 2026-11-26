export const CONTENT_STATUSES = ['PUBLISHED', 'DRAFT'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
