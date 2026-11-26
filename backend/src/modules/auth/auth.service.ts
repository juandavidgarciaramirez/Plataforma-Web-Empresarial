import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { AUTH_REPOSITORY, AuthRepository } from './repositories/auth.repository.interface';
import {
  PASSWORD_RESET_REPOSITORY,
  PasswordResetRepository,
} from './repositories/password-reset.repository.interface';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AccessTokenPayload, RefreshTokenPayload } from '../../common/interfaces/jwt-payload.interface';
import { parseDurationToSeconds } from '../../common/utils/time.util';
import { UserEntity } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { MAILER, Mailer } from '../../common/mailer/mailer.interface';

/** Mensaje genérico de recuperación — nunca revela si el correo existe (sección 5 del brief). */
const GENERIC_FORGOT_PASSWORD_MESSAGE =
  'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.';

interface LoginAttemptEntry {
  count: number;
  lockedUntil: number | null;
}

@Injectable()
export class AuthService {
  /**
   * Control de intentos fallidos de login (secciones 3/4 del brief),
   * EN MEMORIA — clave: email normalizado. Se resetea al reiniciar el
   * proceso; suficiente para esta fase, igual que el resto de repositorios
   * temporales.
   */
  private readonly failedLoginAttempts = new Map<string, LoginAttemptEntry>();

  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    @Inject(PASSWORD_RESET_REPOSITORY) private readonly passwordResetRepository: PasswordResetRepository,
    @Inject(MAILER) private readonly mailer: Mailer,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  async login(dto: LoginDto, requestMeta?: { ipAddress?: string; userAgent?: string }): Promise<AuthResponseDto> {
    const attemptKey = dto.email.toLowerCase().trim();
    this.assertLoginNotLocked(attemptKey);

    const user = await this.usersService.findEntityByEmail(dto.email);

    if (!user) {
      this.registerFailedLoginAttempt(attemptKey);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      this.registerFailedLoginAttempt(attemptKey);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.failedLoginAttempts.delete(attemptKey);
    await this.usersService.recordLogin(user.id);
    this.auditService.log(user.email, 'auth.login', `Inicio de sesión: ${user.email}`);

    return this.issueTokens(user, requestMeta);
  }

  /** Rechaza el intento si la cuenta está temporalmente bloqueada (sección 3/4 del brief). */
  private assertLoginNotLocked(attemptKey: string): void {
    const entry = this.failedLoginAttempts.get(attemptKey);
    if (entry?.lockedUntil && entry.lockedUntil > Date.now()) {
      const minutesLeft = Math.max(1, Math.ceil((entry.lockedUntil - Date.now()) / 60_000));
      throw new UnauthorizedException(
        `Demasiados intentos fallidos. Intenta de nuevo en ${minutesLeft} minuto(s).`,
      );
    }
  }

  /** Suma un intento fallido; bloquea temporalmente al superar el máximo configurado. */
  private registerFailedLoginAttempt(attemptKey: string): void {
    const maxAttempts = this.configService.get<number>('login.maxAttempts') ?? 5;
    const lockoutMinutes = this.configService.get<number>('login.lockoutMinutes') ?? 15;

    const entry = this.failedLoginAttempts.get(attemptKey) ?? { count: 0, lockedUntil: null };
    entry.count += 1;

    if (entry.count >= maxAttempts) {
      entry.lockedUntil = Date.now() + lockoutMinutes * 60_000;
      entry.count = 0;
      this.auditService.log(
        attemptKey,
        'auth.account-locked',
        `Cuenta bloqueada temporalmente tras ${maxAttempts} intentos fallidos: ${attemptKey}`,
      );
    }

    this.failedLoginAttempts.set(attemptKey, entry);
  }

  async refresh(
    refreshToken: string,
    requestMeta?: { ipAddress?: string; userAgent?: string },
  ): Promise<AuthResponseDto> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const session = await this.authRepository.findSessionById(payload.jti);

    if (!session || session.revoked || session.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('La sesión ya no es válida, inicia sesión nuevamente');
    }

    const user = await this.usersService.findEntityById(payload.sub);

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    // Rotación: se revoca la sesión usada y se emite un par de tokens nuevo.
    await this.authRepository.revokeSession(session.id);

    return this.issueTokens(user, requestMeta);
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = this.jwtService.decode(refreshToken) as RefreshTokenPayload | null;

    if (payload?.jti) {
      await this.authRepository.revokeSession(payload.jti);
    }
  }

  /**
   * Solicita la recuperación de contraseña (secciones 5/45 del brief).
   * Responde SIEMPRE con el mismo mensaje genérico exista o no el correo —
   * solo si existe (y está activo) se genera el token y se "envía" el
   * correo (por ahora vía `ConsoleMailerService`, ver `mailer.module.ts`).
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findEntityByEmail(email);

    if (user && user.status === 'ACTIVE') {
      // `security.password_resets.token` es tipo `uuid` real en Postgres
      // (Etapa 2) -> se genera un UUID, no un hex arbitrario.
      const token = randomUUID();
      const ttlSeconds = parseDurationToSeconds(
        this.configService.get<string>('passwordReset.expiresIn') ?? '1h',
      );
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

      await this.passwordResetRepository.create({ token, userId: user.id, expiresAt });

      const frontendUrl = this.configService.get<string>('frontendUrl');
      const resetLink = `${frontendUrl}/reset-password/${token}`;

      await this.mailer.send({
        to: user.email,
        subject: 'Recupera tu contraseña — Capital Consulting',
        text: `Hola ${user.name},\n\nRecibimos una solicitud para restablecer tu contraseña. Este enlace es válido por un tiempo limitado:\n\n${resetLink}\n\nSi no fuiste tú, ignora este correo.`,
      });

      this.auditService.log(user.email, 'auth.forgot-password', `Solicitud de recuperación: ${user.email}`);
    }

    return { message: GENERIC_FORGOT_PASSWORD_MESSAGE };
  }

  /**
   * Restablece la contraseña a partir de un token válido (no usado, no
   * expirado). Revoca todas las sesiones (refresh tokens) activas del
   * usuario, para que un token filtrado no deje sesiones antiguas vivas.
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const resetToken = await this.passwordResetRepository.findByToken(token);

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('El enlace de recuperación es inválido o ya expiró');
    }

    const user = await this.usersService.findEntityById(resetToken.userId);
    if (!user) {
      throw new BadRequestException('El enlace de recuperación es inválido o ya expiró');
    }

    await this.usersService.update(user.id, { password: newPassword }, user.email);
    await this.passwordResetRepository.markUsed(token);
    await this.authRepository.revokeAllForUser(user.id);

    this.auditService.log(user.email, 'auth.reset-password', `Contraseña restablecida: ${user.email}`);

    return { message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' };
  }

  /** Cambio de contraseña desde el perfil del usuario autenticado (secciones 13/46). */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findEntityById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      throw new BadRequestException('La contraseña actual no es correcta');
    }

    await this.usersService.update(user.id, { password: newPassword }, user.email);
    this.auditService.log(user.email, 'auth.change-password', `Cambio de contraseña: ${user.email}`);

    return { message: 'Contraseña actualizada correctamente' };
  }

  private async issueTokens(
    user: UserEntity,
    requestMeta?: { ipAddress?: string; userAgent?: string },
  ): Promise<AuthResponseDto> {
    const role = await this.rolesService.findEntityById(user.roleId);

    const accessPayload: AccessTokenPayload = { sub: user.id, email: user.email };
    const accessExpiresIn = this.configService.get<string>('jwt.accessExpiresIn')!;
    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: accessExpiresIn,
    });

    const jti = randomUUID();
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn')!;
    const refreshSeconds = parseDurationToSeconds(refreshExpiresIn);
    const expiresAt = new Date(Date.now() + refreshSeconds * 1000);

    const refreshPayload: RefreshTokenPayload = { sub: user.id, jti };
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: refreshExpiresIn,
    });

    await this.authRepository.createSession({
      id: jti,
      userId: user.id,
      expiresAt,
      ipAddress: requestMeta?.ipAddress,
      userAgent: requestMeta?.userAgent,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: parseDurationToSeconds(accessExpiresIn),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        roleName: role?.name ?? 'DESCONOCIDO',
        permissions: role?.permissionKeys ?? [],
      },
    };
  }
}
