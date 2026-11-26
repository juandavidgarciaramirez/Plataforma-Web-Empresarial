import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

/**
 * Autorización usuario → rol → permiso. Sin `@Permissions()` en el handler,
 * no restringe. Requiere que el usuario tenga TODOS los permisos indicados.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    const hasAll = user && required.every((permission) => user.permissions.includes(permission));

    if (!hasAll) {
      throw new ForbiddenException('No tienes los permisos requeridos para esta acción');
    }

    return true;
  }
}
