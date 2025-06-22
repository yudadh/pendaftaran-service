import { Server } from 'http';
import app from './index';
import { prisma } from './utils/database';
import { env } from './config/envConfig';
import { logger } from './utils/logger';

let server: Server;
prisma.$connect().then(() => {
  logger.info('Connected to SQL Database');
  server = app.listen(env.PORT, () => {
    console.log(env.NODE_ENV)
    logger.info(`Listening to port ${env.PORT}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});