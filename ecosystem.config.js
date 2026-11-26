// Supervisor de procesos (pm2) para desarrollo local — evita que el backend
// o el frontend se queden caídos en silencio (incidente real: Etapa 9,
// 2026-08-28, el backend murió sin supervisor y tumbó el Hero de Home).
// pm2 reinicia automáticamente cualquier proceso que se caiga.
//
// Uso:
//   pm2 start ecosystem.config.js   -> arranca ambos
//   pm2 status                      -> ver estado
//   pm2 logs                        -> ver logs en vivo
//   pm2 restart all | backend | frontend
//   pm2 stop all
module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: __dirname + '/backend',
      script: 'dist/main.js',
      watch: false,
      autorestart: true,
      max_restarts: 20,
      min_uptime: '10s',
      restart_delay: 1000,
      out_file: __dirname + '/backend/pm2-out.log',
      error_file: __dirname + '/backend/pm2-err.log',
    },
    {
      name: 'frontend',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'dev',
      watch: false,
      autorestart: true,
      max_restarts: 20,
      min_uptime: '10s',
      restart_delay: 1000,
      out_file: __dirname + '/pm2-out.log',
      error_file: __dirname + '/pm2-err.log',
    },
  ],
};
