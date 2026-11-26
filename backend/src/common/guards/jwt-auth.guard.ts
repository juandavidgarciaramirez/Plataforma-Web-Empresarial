import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { AccessTokenPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../modules/users/users.service';
import { RolesService } from '../../modules/roles/roles.service';

/**
 * Guard global de autenticación. Verifica el access token JWT y adjunta el
 * usuario (con rol y permisos resueltos EN CADA REQUEST, no desde el token)
 * a `request.user`, para que revocar un rol o desactivar un usuario surta
 * efecto de inmediato sin esperar a que expire el access token.
 *
 * Los endpoints marcados con `@Public()` se saltan esta verificación.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token de acceso no proporcionado');
    }

    let payload: AccessTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret: this.configService.get<string>('jwt.accessSecret'),
      });
    } catch {
      throw new UnauthorizedException('Token de acceso inválido o expirado');
    }

    const user = await this.usersService.findEntityById(payload.sub);

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    const role = await this.rolesService.findEntityById(user.roleId);

    if (!role) {
      throw new UnauthorizedException('El usuario no tiene un rol válido asignado');
    }

    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: role.id,
      roleName: role.name,
      permissions: role.permissionKeys,
    };

    return true;
  }

  private extractToken(request: AuthenticatedRequest): string | undefined {
    const header = request.headers.authorization;
    if (!header) return undefined;
    const [type, token] = header.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
