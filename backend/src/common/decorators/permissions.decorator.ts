import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from '../../modules/permissions/permissions.constants';

export const PERMISSIONS_KEY = 'permissions';

/** Restringe el endpoint a usuarios cuyo rol tenga TODOS los permisos indicados. */
export const Permissions = (...permissions: PermissionKey[]) => SetMetadata(PERMISSIONS_KEY, permissions);
