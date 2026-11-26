import { TaskEntity } from '../entities/task.entity';

/** Contrato de persistencia para tareas. Implementación temporal en memoria. */
export interface TaskRepository {
  findAll(): Promise<TaskEntity[]>;
  findById(id: string): Promise<TaskEntity | null>;
  create(data: Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskEntity>;
  update(
    id: string,
    data: Partial<Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TaskEntity | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export const TASK_REPOSITORY = 'TASK_REPOSITORY';
