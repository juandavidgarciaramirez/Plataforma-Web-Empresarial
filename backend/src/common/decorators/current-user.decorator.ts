import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, RequestUser } from '../interfaces/authenticated-request.interface';

/** Extrae el usuario autenticado (adjuntado por JwtAuthGuard) del request. */
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): RequestUser => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user;
});
