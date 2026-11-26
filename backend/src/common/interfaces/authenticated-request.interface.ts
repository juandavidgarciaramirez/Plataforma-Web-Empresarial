import { Request } from 'express';

export interface RequestUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
