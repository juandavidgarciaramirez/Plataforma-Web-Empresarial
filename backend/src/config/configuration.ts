export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  seedAdmin: {
    // Sin valores por defecto: unas credenciales conocidas nunca deben crear un administrador.
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
  },
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  mailer: {
    sendmailPath:
      process.env.SENDMAIL_PATH ??
      (process.env.NODE_ENV === 'production' ? '/sbin/sendmail' : ''),
  },
  passwordReset: {
    expiresIn: process.env.PASSWORD_RESET_EXPIRES_IN ?? '1h',
  },
  login: {
    maxAttempts: parseInt(process.env.LOGIN_MAX_ATTEMPTS ?? '5', 10),
    lockoutMinutes: parseInt(process.env.LOGIN_LOCKOUT_MINUTES ?? '15', 10),
  },
});
