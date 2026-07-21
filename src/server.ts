import { buildApp } from '@/app';
import { env } from '@/core/config/env.config';

const signals = ['SIGINT', 'SIGTERM'] as const;

const start = async (): Promise<void> => {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`🚀 Server listening at http://${env.HOST}:${env.PORT}`);
    app.log.info(`📖 Swagger documentation available at http://${env.HOST}:${env.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown signals
  for (const signal of signals) {
    process.on(signal, () => {
      app.log.info(`Received ${signal}, closing server...`);
      app
        .close()
        .then(() => {
          app.log.info('Server closed successfully. Exiting.');
          process.exit(0);
        })
        .catch((err: unknown) => {
          app.log.error(err as Error, 'Error during server shutdown');
          process.exit(1);
        });
    });
  }
};

// Start the server
start().catch((err: unknown) => {
  process.stderr.write(`Unhandled error during startup: ${String(err)}\n`);
  process.exit(1);
});
