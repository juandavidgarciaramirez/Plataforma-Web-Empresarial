import { CrmEntityType } from '../../common/crm.types';

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export class TaskEntity {
  id!: string;
  title!: string;
  description!: string | null;
  dueDate!: Date | null;
  assigneeUserId!: string | null;
  priority!: TaskPriority;
  status!: TaskStatus;
  relatedType!: CrmEntityType | null;
  relatedId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
