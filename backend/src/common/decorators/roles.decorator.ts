import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../modules/roles/roles.constants';

export const ROLES_KEY = 'roles';

/** Restringe el endpoint a uno o más nombres de rol. */
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
